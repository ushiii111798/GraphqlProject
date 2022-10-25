import { Storage } from '@google-cloud/storage';
import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch/dist';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Image } from './entities/image.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,

    private readonly elasticsearchService: ElasticsearchService,
  ) {}

  async findImages({ boardId = null, productId = null }) {
    console.log(boardId, productId);
    if (productId == null) {
      const images = await this.imagesRepository
        .createQueryBuilder('image')
        .select(['image.id', 'image.image', 'image.isMain', 'image.createdAt'])
        .where('image.board = :boardId', { boardId })
        .getMany();
      console.log(images);
      return images;
    } else if (boardId == null) {
      const images = await this.imagesRepository
        .createQueryBuilder('image')
        .select(['image.id', 'image.image', 'image.isMain', 'image.createdAt'])
        .where('image.product = :productId', { productId })
        .getMany();
      console.log(images);
      return images;
    }
  }

  async savingImage({ images, board = null, product = null }) {
    if (typeof images[0] == 'string') {
      const results = await Promise.all(
        images.map(async (el, idx) => {
          let isMain = false;
          const image = el;
          if (idx == 0) isMain = true;
          return await this.create({
            image,
            isMain,
            board,
            product,
          });
        }),
      );
      return results;
    } else {
      const imageURL: any = await this.upload({ images });
      const results = await Promise.all(
        imageURL?.data.uploadFiles.map(async (el, idx) => {
          let isMain = false;
          if (idx == 0) isMain = true;
          return await this.create({
            image: el,
            isMain,
            board,
            product,
          });
        }),
      );
      return results;
    }
  }

  async upload({ images }) {
    const fileQueue = await Promise.all(images);
    const BUCKET_NAME = process.env.GCS_BUCKET_NAME;
    const URL_PREFIX = process.env.IMAGE_URL_PREFIX;
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCS_KEY_FILE,
    }).bucket(BUCKET_NAME);

    const results = await Promise.all(
      fileQueue.map((el) => {
        const uuid = v4();
        let extension = el.filename.split('.').pop();
        if (extension == 'jpg' || extension == 'JPG' || extension == 'JPEG') {
          extension = 'jpeg';
        }
        const filename = uuid + '.' + extension;
        return new Promise((resolve, reject) => {
          el.createReadStream()
            .pipe(storage.file(filename).createWriteStream())
            .on('finish', () => resolve(`${URL_PREFIX}/${filename}`))
            .on('error', () => reject());
        });
      }),
    );
    return results;
  }

  async deleteExistImage({ boardId = null, productId = null }) {
    const images = await this.findImages({ boardId, productId });
    if (images == null) return;
    const BUCKET_NAME = process.env.GCS_BUCKET_NAME;
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCS_KEY_FILE,
    }).bucket(BUCKET_NAME);

    const results = await Promise.all(
      images.map((el) => {
        const image = el.image.split('/').pop();
        const small = el.thumbnailSmall.split('/').pop();
        const medium = el.thumbnailMedium.split('/').pop();
        const large = el.thumbnailLarge.split('/').pop();
        return new Promise((resolve, reject) => {
          try {
            const result = {
              image: storage.file(image).delete(),
              small: storage.file(`thumb/s/${small}`).delete(),
              medium: storage.file(`thumb/m/${medium}`).delete(),
              large: storage.file(`thumb/l/${large}`).delete(),
            };
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }),
    );
    await Promise.all(
      images.map(async (el) => {
        return await this.imagesRepository.delete({ id: el.id });
      }),
    );
    return results;
  }

  async create({ image, isMain, board, product }) {
    const imageURL = image.split('/').pop();
    const imageName = imageURL.split('.').shift();
    const extension = imageURL.split('.').pop();
    return await this.imagesRepository.save({
      image,
      thumbnailLarge: `${process.env.IMAGE_URL_PREFIX}/thumb/l/${imageName}_TN_1280.${extension}`,
      thumbnailMedium: `${process.env.IMAGE_URL_PREFIX}/thumb/m/${imageName}_TN_640.${extension}`,
      thumbnailSmall: `${process.env.IMAGE_URL_PREFIX}/thumb/s/${imageName}_TN_320.${extension}`,
      isMain,
      board,
      product,
    });
  }

  async delete({ imageId }) {
    const image = await this.imagesRepository.findOne({
      where: { id: imageId },
    });

    const BUCKET_NAME = process.env.GCS_BUCKET_NAME;
    const storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCS_KEY_FILE,
    }).bucket(BUCKET_NAME);

    const small = image.thumbnailSmall.split('/').pop();
    const medium = image.thumbnailMedium.split('/').pop();
    const large = image.thumbnailLarge.split('/').pop();
    storage.file(image.image.split('/').pop()).delete();
    storage.file(`thumb/s/${small}`).delete();
    storage.file(`thumb/m/${medium}`).delete();
    storage.file(`thumb/l/${large}`).delete();

    const result = await this.imagesRepository.delete({ id: imageId });
    return result.affected ? true : false;
  }
}

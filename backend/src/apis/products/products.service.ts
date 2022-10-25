import { Product } from 'src/apis/products/entities/product.entity';
import { Repository } from 'typeorm';
import {
  Injectable,
  UnprocessableEntityException,
  CACHE_MANAGER,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesService } from '../images/images.service';
import { Cache } from 'cache-manager';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    private readonly imagesService: ImagesService,
    private readonly elasticsearchService: ElasticsearchService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findOne({ productId }) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
      relations: ['productDiscounts', 'productCategories'],
    });
    const images = await this.imagesService.findImages({ productId });
    return {
      ...product,
      images,
    };
  }

  async findCache({ search }) {
    const result = await this.cacheManager.get(`product:${search}`);
    console.log('This is from cache : ', result);
    return result;
  }

  async search({ search }) {
    const result: any = await this.elasticsearchService.search({
      index: 'product',
      _source: [
        'id',
        'name',
        'price',
        'deliveryPrice',
        'maxQ',
        'detailText',
        'stock',
        'createdAt',
        'updatedAt',
        'productCategoriesId',
        'category',
      ],
      body: {
        query: {
          match: {
            name: search,
          },
        },
      },
    });
    const products = result.hits.hits.map((el: any) => {
      const createdAt = new Date(el._source.createdAt);
      const updatedAt = new Date(el._source.updatedAt);
      const images = this.imagesService.findImages({
        productId: el._source.id,
      });
      const result: any = this.productsRepository.create({
        ...el._source,
        name: el._source.name,
        price: el._source.price,
        deliveryPrice: el._source.deliveryPrice,
        maxQ: el._source.maxQ,
        detailText: el._source.detailText,
        stock: el._source.stock,
        createdAt,
        updatedAt,
        productCategories: {
          id: el._source.productCategoriesId,
          category: el._source.category,
        },
        images: [],
      });
      result.images = images;
      return result;
    });
    await this.cacheManager.set(`product:${search}`, products, { ttl: 1 });
    return products;
  }

  async findAll() {
    const products = await this.productsRepository.find({
      relations: ['productDiscounts', 'productCategories'],
    });
    const result = products.map(async (el) => {
      const images = await this.imagesService.findImages({ productId: el.id });
      return {
        ...el,
        images,
      };
    });
    return result;
  }

  async create({ createProductInput }) {
    const { productDiscountsId, productCategoriesId, images, ...product } =
      createProductInput;
    const temp = await this.productsRepository.save({
      ...product,
      productDiscounts: productDiscountsId,
      productCategories: productCategoriesId,
    });
    const savedProduct = await this.productsRepository.findOne({
      where: { id: temp.id },
    });

    const result = {
      ...savedProduct,
      images: [],
    };

    if (images) {
      const imageURL = await this.imagesService.savingImage({
        images,
        product: savedProduct,
      });
      result.images = imageURL;
    }
    return result;
  }

  async update({ productId, updateProductInput: _updateProductInput }) {
    const { images, ...updateProductInput } = _updateProductInput;
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    const updateProduct = {
      ...product,
      id: productId,
      ...updateProductInput,
    };

    const savedProduct = await this.productsRepository.save(updateProduct);
    const result = {
      ...savedProduct,
      images: [],
    };
    if (images) {
      const removeFromStroage = await this.imagesService.deleteExistImage({
        productId,
      });
      console.log(removeFromStroage);
      const imageURL = await this.imagesService.savingImage({
        images,
        product: savedProduct,
      });
      result.images = imageURL;
    }

    return result;
  }

  async checkSoldout({ productId }) {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (product.stock < 0)
      throw new UnprocessableEntityException('이미 판매 완료된 상품입니다.');
  }

  async delete({ productId }) {
    const result = await this.productsRepository.softDelete({ id: productId });
    return result.affected ? true : false;
  }

  async restore({ productId }) {
    const result = await this.productsRepository.restore({ id: productId });
    return result.affected ? true : false;
  }

  async hardDelete({ productId }) {
    const result = await this.productsRepository.delete({ id: productId });
    return result.affected ? true : false;
  }

  // show all products include deleted products
  async findAllWithDeleted() {
    return await this.productsRepository.find({
      relations: ['productDiscounts', 'productCategories'],
      withDeleted: true,
    });
  }
}

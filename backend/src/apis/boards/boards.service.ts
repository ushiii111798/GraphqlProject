import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Repository } from 'typeorm';
import {
  Inject,
  Injectable,
  UnprocessableEntityException,
  CACHE_MANAGER,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { ImagesService } from '../images/images.service';
import { Cache } from 'cache-manager';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>,

    private readonly imagesService: ImagesService,
    private readonly elasticsearchService: ElasticsearchService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async findElasticsearch({ search }) {
    const result: any = await this.elasticsearchService.search({
      index: 'board',
      query: {
        match: {
          title: search,
        },
      },
    });
    const boards = result.hits.hits.map(async (el) => {
      const createdAt = new Date(el._source.createdAt);
      const updatedAt = new Date(el._source.updatedAt);
      const assignedAt = new Date(el._source.assignedAt);
      const user_updatedAt = new Date(el._source.user_updatedAt);
      const birth = new Date(el._source.birth);
      const images = await this.imagesService.findImages({
        boardId: el._source.id,
      });
      const result: any = this.boardsRepository.create({
        ...el._source,
        createdAt,
        updatedAt,
        id: el._source.id,
        title: el._source.title,
        content: el._source.content,
        isSecret: el._source.isSecret,
        users: {
          id: el._source.usersId,
          loginId: el._source.loginId,
          name: el._source.name,
          birth,
          sex: el._source.sex,
          grade: el._source.grade,
          pointTotal: el._source.pointTotal,
          email: el._source.email,
          isAgreedEmail: el._source.isAgreedEmail,
          assignedAt,
          updatedAt: user_updatedAt,
        },
        boardLists: {
          id: el._source.boardListsId,
          title: el._source.boardList_title,
        },
        images: [],
      });
      result.images = images;
      return result;
    });
    await this.cacheManager.set(`board:${search}`, boards, { ttl: 1 });
    return boards;
  }

  async findCache({ search }) {
    const result = await this.cacheManager.get(`board:${search}`);
    return result;
  }

  async findOne({ boardId }) {
    const board = await this.boardsRepository.findOne({
      where: { id: boardId },
      relations: ['users', 'boardLists'],
    });
    const images = await this.imagesService.findImages({ boardId });
    console.log(images);
    return {
      ...board,
      images,
    };
  }

  async findAll() {
    const boards = await this.boardsRepository.find({
      relations: ['users', 'boardLists'],
    });
    const result = boards.map(async (el) => {
      const images = await this.imagesService.findImages({ boardId: el.id });
      return {
        ...el,
        images,
      };
    });
    return result;
  }

  async create({ createBoardInput, currentUser }) {
    const { images, ...board } = createBoardInput;
    const temp = await this.boardsRepository.save({
      ...board,
      users: currentUser.id,
    });
    const savedBoard = await this.boardsRepository.findOne({
      where: { id: temp.id },
    });
    const result = {
      ...savedBoard,
      images: [],
    };
    if (images) {
      const savedImage = await this.imagesService.savingImage({
        images,
        board: savedBoard,
      });
      result.images = savedImage;
    }
    return result;
  }

  // TODO: update images process
  async update({ boardId, updateBoardInput: _updateBoardInput }) {
    const { images, ...updateBoardInput } = _updateBoardInput;
    const board = await this.checkPassword({ boardId, updateBoardInput });
    const updateBoard = {
      ...board,
      id: boardId,
      ...updateBoardInput,
    };

    const savedBoard = await this.boardsRepository.save(updateBoard);
    const result = {
      ...savedBoard,
      images: [],
    };
    if (images) {
      const removeFromStroage = await this.imagesService.deleteExistImage({
        boardId,
      });
      console.log(removeFromStroage);
      const imageURL = await this.imagesService.savingImage({
        images,
        board: savedBoard,
      });
      result.images = imageURL;
    }

    return result;
  }

  async checkPassword({ boardId, updateBoardInput }) {
    const product = await this.boardsRepository.findOne({
      where: { id: boardId },
    });
    if (product.isSecret == true) {
      if (product.password !== updateBoardInput.password)
        throw new UnprocessableEntityException('패스워드 오류');
    }
    return product;
  }
}

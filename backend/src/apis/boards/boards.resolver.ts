import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { BoardsService } from './boards.service';
import { CreateBoardInput } from './dto/createBoard.input';
import { CreateBoardWithImageURLInput } from './dto/createBoardWithImageURL.input';
import { UpdateBoardInput } from './dto/updateBoard.input';
import { UpdateBoardWithImageURLInput } from './dto/updateBoardWithImageURL.input';
import { Board } from './entities/board.entity';

@Resolver()
export class BoardsResolver {
  constructor(private readonly boardsService: BoardsService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Board, { description: 'Fetching Board / Permission Needed' })
  async fetchBoard(@Args('boardId') boardId: string) {
    return await this.boardsService.findOne({ boardId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Board], {
    description: 'Fetching All Boards / Permission Needed',
  })
  async fetchBoards(@Args('search') search: string) {
    const cacheResult = await this.boardsService.findCache({ search });
    if (cacheResult !== null) {
      return cacheResult;
    }

    const result = await this.boardsService.findElasticsearch({ search });
    return result;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board, {
    description:
      'Board Create, Image should be uploaded bia FileStream / Permission Needed',
  })
  async createBoard(
    @Args('createBoardInput') createBoardInput: CreateBoardInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.boardsService.create({
      createBoardInput,
      currentUser,
    });
    console.log(result);
    return result;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board, {
    description:
      'Board Create, Image URL must be provided by URL string / Permission Needed',
  })
  async createBoardWithImageURL(
    @Args('createBoardInput') createBoardInput: CreateBoardWithImageURLInput,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.boardsService.create({
      createBoardInput,
      currentUser,
    });
    console.log(result);
    return result;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board, {
    description:
      'Board Update, Image should be uploaded directly via FileStream / Permission Needed',
  })
  async updateBoard(
    @Args('boardId') boardId: string,
    @Args('updateBoardInput') updateBoardInput: UpdateBoardInput,
  ) {
    return await this.boardsService.update({ boardId, updateBoardInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Board, {
    description:
      'Board Update, Image URL must be provided by URL string / Permission Needed',
  })
  async updateBoardWithImageURL(
    @Args('boardId') boardId: string,
    @Args('updateBoardInput') updateBoardInput: UpdateBoardWithImageURLInput,
  ) {
    return await this.boardsService.update({ boardId, updateBoardInput });
  }
}

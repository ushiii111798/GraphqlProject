import { UseGuards } from '@nestjs/common/decorators';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser } from 'src/common/auth/gql-user.param';
import { CreateUserInput } from './dto/createUser.input';
import { UpdateUserInput } from './dto/updateUser.input';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchUser(@Args('userId') userId: string) {
    return this.usersService.findOneWithUserId({ userId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  fetchLoginUser(@CurrentUser() CurrentUser: any) {
    console.log(CurrentUser);
    return this.usersService.findOneWithLoginId({
      loginId: CurrentUser.loginId,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [User])
  fetchUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [User])
  fetchUsersWithDeleted() {
    return this.usersService.findAllWithDeleted();
  }

  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    await this.usersService.checkUserExist({ email: createUserInput.email });
    return this.usersService.create({ createUserInput });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateUser(
    @CurrentUser() currentUser: any,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update({
      userId: currentUser.sub,
      updateUserInput,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async updateUserPwd(
    @CurrentUser() currentUser: any,
    @Args('loginPass') loginPass: string,
  ) {
    console.log(currentUser);
    return this.usersService.updatePwd({
      userId: currentUser.sub,
      loginPass,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteUser(@Args('userId') userId: string) {
    return this.usersService.softDelete({ userId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  deleteLoginUser(@CurrentUser() currentUser: any) {
    return this.usersService.softDeleteWithLoginId({
      loginId: currentUser.loginId,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  restoreUser(@Args('userId') userId: string) {
    return this.usersService.restore({ userId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  hardDeleteUser(@Args('userId') userId: string) {
    return this.usersService.hardDelete({ userId });
  }
}

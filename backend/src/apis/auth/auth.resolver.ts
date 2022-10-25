import { UnprocessableEntityException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/common/auth/gql-auth.guard';
import { CurrentUser } from 'src/common/auth/gql-user.param';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('loginId') loginId: string,
    @Args('loginPass') loginPass: string,
    @Context() context: any,
  ) {
    const user = await this.usersService.findOneWithLoginId({ loginId });
    if (!user) {
      throw new UnprocessableEntityException('User not found');
    }
    const isPasswordCorrect = await bcrypt.compare(loginPass, user.loginPass);
    if (!isPasswordCorrect) {
      throw new UnprocessableEntityException('Password is incorrect');
    }

    this.authService.setRefreshToken({ user, res: context.res });

    return this.authService.getAccessToken({ user });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(@Context() context: any) {
    console.log(context.req.headers);
    return this.authService.logout({ req: context.req, res: context.res });
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  async restoreAccessToken(@CurrentUser() currentUser: any) {
    return this.authService.getAccessToken({ user: currentUser });
  }
}

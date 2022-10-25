import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { apiPlainLogger } from 'src/config/winston';

interface IOAuthUser {
  user: Pick<
    User,
    'loginId' | 'loginPass' | 'name' | 'email' | 'birth' | 'sex'
  >;
}

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  loginNaver() {
    apiPlainLogger.info('MAINPROJECT | loginNaver requested');
    return;
  }

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  loginGoogle() {
    apiPlainLogger.info('MAINPROJECT | loginGoogle requested');
    return;
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  loginKakao() {
    apiPlainLogger.info('MAINPROJECT | loginKakao requested');
    return;
  }

  @Get('/login/facebook')
  @UseGuards(AuthGuard('facebook'))
  loginFacebook() {
    apiPlainLogger.info('MAINPROJECT | loginFacebook requested');
    return;
  }

  @Get('/login/google/oauth')
  @UseGuards(AuthGuard('google'))
  async loginGoogleAuth(
    @Req() req: Request & IOAuthUser,
    @Res() res: Response,
  ) {
    this.authService.successlogin(req, res);
  }

  @Get('/login/naver/oauth')
  @UseGuards(AuthGuard('naver'))
  async loginNaverAuth(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    this.authService.successlogin(req, res);
  }

  @Get('/login/kakao/oauth')
  @UseGuards(AuthGuard('kakao'))
  async loginKakaoAuth(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    this.authService.successlogin(req, res);
  }

  @Get('/login/facebook/oauth')
  @UseGuards(AuthGuard('facebook'))
  async loginFacebookAuth(
    @Req() req: Request & IOAuthUser,
    @Res() res: Response,
  ) {
    this.authService.successlogin(req, res);
  }
}

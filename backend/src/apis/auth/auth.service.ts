import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserInput } from '../users/dto/createUser.input';
import { UsersService } from '../users/users.service';
import { apiPlainLogger } from 'src/config/winston';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  getAccessToken({ user }) {
    console.log(user);
    return this.jwtService.sign(
      { loginId: user.loginId, sub: user.id },
      { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '1h' },
    );
  }

  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { loginId: user.loginId, sub: user.id },
      { secret: process.env.JWT_REFRESH_SECRET, expiresIn: '2w' },
    );
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);
  }

  async logout({ req, res }) {
    const headers = req.headers;
    const refreshToken = headers.cookie.split('=').pop();
    const accessToken = headers.authorization.split(' ').pop();
    try {
      const accessDecoded: any = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET,
      );
      const refreshDecoded: any = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
      );
      console.log(accessDecoded);
      console.log(refreshDecoded);
      if (accessDecoded.sub === refreshDecoded.sub) {
        // calculate ttl now date - exp as seconds
        const ttl_access = Math.floor(
          (new Date(accessDecoded.exp * 1000).getTime() - Date.now()) / 1000,
        );
        await this.cacheManager.set(`accessToken:${accessToken}`, accessToken, {
          ttl: ttl_access,
        });
        const ttl_refresh = Math.floor(
          (new Date(refreshDecoded.exp * 1000).getTime() - Date.now()) / 1000,
        );
        await this.cacheManager.set(
          `refreshToken:${refreshToken}`,
          refreshToken,
          { ttl: ttl_refresh },
        );

        res.setHeader('Set-Cookie', `refreshToken=; path=/;`);
        return '로그아웃에 성공했습니다.';
      }
    } catch (e) {
      throw new UnauthorizedException('Access token is not valid');
    }
  }

  async successlogin(req, res) {
    {
      const url = req.url;
      apiPlainLogger.info(`success login url: ${url}`);
      let user = await this.usersService.findOneWithLoginId({
        loginId: req.user.loginId,
      });
      if (!user) {
        const newUser: CreateUserInput = {
          loginId: req.user.loginId,
          loginPass: req.user.loginPass,
          name: req.user.name,
          email: req.user.email,
          birth: req.user.birth,
          sex: req.user.sex,
          grade: 'Bronze',
          isAgreedEmail: true,
        };
        console.log(newUser);
        user = await this.usersService.create({ createUserInput: newUser });
      }

      this.setRefreshToken({ user, res });
      res.redirect(
        'http://localhost:5500/main-project/frontend/login/success.html',
      );
    }
  }
}

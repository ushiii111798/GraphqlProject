import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    super({
      jwtFromRequest: (req) => {
        console.log(req);
        const cookie = req.headers.cookie;
        const splitCookie = cookie.split(' ');
        let target = 0;
        for (let i = 0; i < splitCookie.length; i++) {
          if (splitCookie[i].includes('refreshToken=')) target = i;
        }
        const refreshToken = splitCookie[target].replace('refreshToken=', '');
        return refreshToken;
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET,
    });
  }

  async validate(req, payload) {
    // get refreshtoken from req
    const refreshToken = req.headers.cookie.split(' ').pop();
    // check if refreshtoken is in redis
    const isRefreshTokenInRedis = await this.cacheManager.get(
      `refreshToken:${refreshToken}`,
    );
    if (isRefreshTokenInRedis) {
      throw new UnauthorizedException('Token is revoked');
    } else {
      return { loginId: payload.loginId, id: payload.sub };
    }
  }
}

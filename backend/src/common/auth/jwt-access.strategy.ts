import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    // get accesstoken from req
    const accessToken = req.headers.authorization.split(' ').pop();
    // check if accesstoken is in redis
    const isAccessTokenInRedis = await this.cacheManager.get(
      `accessToken:${accessToken}`,
    );
    if (isAccessTokenInRedis) {
      throw new UnauthorizedException('Token is revoked');
    } else {
      return { loginId: payload.loginId, id: payload.sub };
    }
  }
}

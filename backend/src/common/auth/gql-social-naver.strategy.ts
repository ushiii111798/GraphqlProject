import { PassportStrategy } from '@nestjs/passport';
import { Strategy as NaverStrategy } from 'passport-naver-v2';

export class JwtNaverStrategy extends PassportStrategy(NaverStrategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/naver/oauth',
    });
  }

  validate(accessToken, refreshToken, profile, done) {
    console.log(profile);
    const data = {
      loginId: profile.id,
      loginPass: '123456789',
      email: profile.email,
      name: profile.name,
      birth: profile.birthYear + '-' + profile.birthday,
      sex: profile.gender,
    };
    console.log(data);
    return data;
  }
}

import { PassportStrategy } from '@nestjs/passport';
import { Strategy as KakaoStrategy } from 'passport-kakao';

export class JwtKakaoStrategy extends PassportStrategy(KakaoStrategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/kakao/oauth',
    });
  }

  validate(accessToken, refreshToken, profile, done) {
    console.log(profile);
    const data = profile._json.kakao_account;
    return {
      loginId: profile.id,
      loginPass: '123456789',
      email: data.email,
      name: profile.displayName,
      birth: data.birthday
        ? '0000-' +
          String(data.birthday).slice(0, 2) +
          '-' +
          String(data.birthday).slice(2, 4)
        : null,
      sex: data.gender ? data.gender : null,
    };
  }
}

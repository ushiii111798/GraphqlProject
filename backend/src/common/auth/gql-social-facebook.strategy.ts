import { PassportStrategy } from '@nestjs/passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';

export class JwtFacebookStrategy extends PassportStrategy(
  FacebookStrategy,
  'facebook',
) {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/facebook/oauth',
      profileFields: ['id', 'displayName', 'email', 'birthday'],
    });
  }

  validate(accessToken, refreshToken, profile, done) {
    console.log(profile);
    return {
      loginId: profile.id,
      loginPass: '123456789',
      email: 'ushiii111798@gmail.com',
      name: profile.displayName,
      birth: '1999-11-17',
      sex: '남',
    };
  }
}

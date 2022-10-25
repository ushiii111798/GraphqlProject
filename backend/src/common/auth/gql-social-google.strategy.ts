import { PassportStrategy } from '@nestjs/passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export class JwtGoogleStrategy extends PassportStrategy(
  GoogleStrategy,
  'google',
) {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/google/oauth',
      scope: ['email', 'profile'],
    });
  }

  validate(accessToken, refreshToken, profile) {
    console.log(profile);
    return {
      loginId: profile.id,
      loginPass: '123456789',
      email: profile.emails[0].value,
      name: profile.displayName,
      birth: '2021-01-01',
      sex: '남',
    };
  }
}

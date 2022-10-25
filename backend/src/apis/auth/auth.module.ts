import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtFacebookStrategy } from 'src/common/auth/gql-social-facebook.strategy';
import { JwtGoogleStrategy } from 'src/common/auth/gql-social-google.strategy';
import { JwtKakaoStrategy } from 'src/common/auth/gql-social-kakao.strategy';
import { JwtNaverStrategy } from 'src/common/auth/gql-social-naver.strategy';
import { JwtRefreshStrategy } from 'src/common/auth/jwt-refresh.strategy';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([User])],
  providers: [
    AuthResolver,
    AuthService,
    UsersService,
    JwtRefreshStrategy,
    JwtGoogleStrategy,
    JwtNaverStrategy,
    JwtKakaoStrategy,
    JwtFacebookStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}

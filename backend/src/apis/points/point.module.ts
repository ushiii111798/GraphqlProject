import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Point } from './entities/point.entity';
import { PointResolver } from './point.resolver';
import { PointService } from './point.service';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Point, User])],
  providers: [PointResolver, PointService],
})
export class PointModule {}

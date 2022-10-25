import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/apis/users/entities/user.entity';
import { IAMPortService } from '../iamport/iamport.service';
import { Point } from '../points/entities/point.entity';
import { PointService } from '../points/point.service';
import { Payment } from './entities/payment.entity';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User, Point])],
  providers: [PaymentResolver, PaymentService, PointService, IAMPortService],
})
export class PaymentModule {}

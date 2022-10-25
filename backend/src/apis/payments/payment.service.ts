import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { apiPlainLogger } from 'src/config/winston';
import {
  ORDER_TRANSACTION_STATUS_ENUM,
  Payment,
} from './entities/payment.entity';
import { IAMPortService } from '../iamport/iamport.service';
import { PointService } from '../points/point.service';
import { ConflictException } from '@nestjs/common/exceptions';
import { Point, POINT_STATUS_ENUM } from '../points/entities/point.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Point)
    private readonly pointRepository: Repository<Point>,

    private readonly iamportService: IAMPortService,
    private readonly connection: Connection,
  ) {}

  async create({ impUid, amount, currentUser: _user }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const isExist = await queryRunner.manager.findOne(Payment, {
        where: { impUid },
        lock: { mode: 'pessimistic_write' },
      });

      if (isExist != null)
        throw new ConflictException('이미 존재하는 결제입니다.');
      else {
        const isValid = await this.iamportService.checkPayment({ impUid });
        if (isValid == null) {
          throw new UnprocessableEntityException(
            '유효하지 않은 imp_uid 입니다.',
          );
        } else {
          if (isValid.data?.response.amount !== amount)
            throw new UnprocessableEntityException('결제 금액 오류');
        }
        const point = this.pointRepository.create({
          name: '포인트 충전',
          point: amount,
          user: _user.id,
          status: POINT_STATUS_ENUM.CREDIT,
        });
        const pointResult: any = await queryRunner.manager.save(Point, point);
        const transaction = this.paymentRepository.create({
          price: amount,
          priceTotal: amount,
          status: ORDER_TRANSACTION_STATUS_ENUM.PAYMENT,
          impUid,
          user: _user.id,
          point: pointResult.id,
        });
        const result = await queryRunner.manager.save(transaction);

        await queryRunner.commitTransaction();
        return result;
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async refund({ imp_uid, currentUser }) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');
    try {
      const isCanceled = await this.paymentRepository
        .createQueryBuilder('payment')
        .setLock('pessimistic_write')
        .select('payment')
        .where('payment.impUid = :impUid', { impUid: imp_uid })
        .andWhere('payment.status = :status', {
          status: ORDER_TRANSACTION_STATUS_ENUM.CANCEL,
        })
        .getRawOne();
      console.log('isCanceled : ', isCanceled);
      if (isCanceled == undefined) {
        const result = await this.iamportService.refundReq({
          imp_uid,
        });
        const point: any = this.pointRepository.create({
          name: '테스트 결제 환불',
          point: 0 - result.data.response.cancel_amount,
          user: currentUser.id,
          status: POINT_STATUS_ENUM.CANCEL,
        });
        const pointResult: any = await queryRunner.manager.save(Point, point);
        const refund = this.paymentRepository.create({
          price: 0 - result.data.response.cancel_amount,
          priceTotal: 0 - result.data.response.cancel_amount,
          status: ORDER_TRANSACTION_STATUS_ENUM.CANCEL,
          impUid: imp_uid,
          user: currentUser.id,
          point: pointResult.id,
        });
        const refundPayment = await queryRunner.manager.save(Payment, refund);

        await queryRunner.commitTransaction();
        return refundPayment;
      } else {
        apiPlainLogger.error(
          `MAINPROJECT | Payment ${imp_uid} is not refunded`,
        );
        throw new ConflictException('이미 취소된 결제입니다.');
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

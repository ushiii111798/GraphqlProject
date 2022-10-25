import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { apiPlainLogger } from 'src/config/winston';
import { PointService } from '../points/point.service';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly pointService: PointService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async createPayment(
    @Args('impUid') impUid: string,
    @Args('amount') amount: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.paymentService.create({
      impUid,
      amount,
      currentUser,
    });
    const total = await this.pointService.updatePointTotal(currentUser.id);
    apiPlainLogger.info(
      `MAINPROJECT | Payment ${impUid} is created by ${currentUser.name} / Total Paid : ${amount} / Total Point : ${total}`,
    );
    return result;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async cancelPayment(
    @Args('impUid') impUid: string,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const result = await this.paymentService.refund({
      imp_uid: impUid,
      currentUser,
    });
    const total = await this.pointService.updatePointTotal(currentUser.id);
    apiPlainLogger.info(
      `MAINPROJECT | Payment ${impUid} is refunded by ${currentUser.name} / Total Refund : &{result.priceTotal} / Total Point : ${total}`,
    );
    return result;
  }
}

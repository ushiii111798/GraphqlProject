import { Injectable } from '@nestjs/common';
import { UnprocessableEntityException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { Payment } from '../payments/entities/payment.entity';

@Injectable()
export class IAMPortService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async getToken() {
    const apiTokenReq = await axios({
      url: 'https://api.iamport.kr/users/getToken',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: {
        imp_key: process.env.IAMPORT_API_KEY,
        imp_secret: process.env.IAMPORT_API_SECRET,
      },
    });
    return apiTokenReq.data.response.access_token;
  }

  //check if payment has valid amount and imp_uid
  async checkPayment({ impUid }) {
    const token = await this.getToken();
    console.log('hello');
    const payment: any = await axios({
      url: 'https://api.iamport.kr/payments/' + impUid,
      method: 'get',
      headers: { Authorization: token },
    }).catch((err) => {
      console.log(err);
    });
    console.log('This is payment : ', payment);
    if (payment == null)
      throw new UnprocessableEntityException('결제 정보가 없습니다.');
    else return payment;
  }

  async refundReq({ imp_uid }) {
    console.log(imp_uid);
    const token = await this.getToken();
    const result = await axios({
      url: 'https://api.iamport.kr/payments/cancel',
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      data: {
        reason: '테스트 결제 환불',
        imp_uid,
      },
    });
    console.log(result);
    if (result.data.code != 0) {
      throw new UnprocessableEntityException('환불 요청이 실패했습니다.');
    } else {
      return result;
    }
  }
}

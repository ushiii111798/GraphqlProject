import { Point } from '../../points/entities/point.entity';
import { User } from '../../users/entities/user.entity';
// import { Order } from '../../orders/entities/order.entity';
// import { Coupon } from '../../coupons/entities/coupon.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum ORDER_TRANSACTION_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
  COMPLETE = 'COMPLETE',
}
registerEnumType(ORDER_TRANSACTION_STATUS_ENUM, {
  name: 'ORDER_TRANSACTION_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  // TODO: Related to Discount of the order

  // @Column({ type: 'int', default: 0 })
  // @Field(() => Number, { nullable: true })
  // couponPrice: number;

  // @Column({ type: 'int', default: 0 })
  // @Field(() => Number, { nullable: true })
  // pointPrice: number;

  @Column({ type: 'int' })
  @Field(() => Number)
  price: number;

  @Column({ type: 'int' })
  @Field(() => Number)
  priceTotal: number;

  @Column({
    type: 'enum',
    enum: ORDER_TRANSACTION_STATUS_ENUM,
    default: ORDER_TRANSACTION_STATUS_ENUM.PAYMENT,
  })
  @Field(() => ORDER_TRANSACTION_STATUS_ENUM)
  status: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Column()
  @Field(() => String)
  impUid: string;

  // @ManyToOne(() => Coupon)
  // @Field(() => [Coupon])
  // coupons: Coupon[];

  // TODO: Join Order(Handling Payment by orders)
  // @JoinColumn()
  // @OneToOne(() => Order)
  // @Field(() => Order)
  // order: Order;

  @ManyToOne(() => User)
  @Field(() => User, { nullable: true })
  user: User;

  @JoinColumn()
  @OneToOne(() => Point)
  @Field(() => Point, { nullable: true })
  point: Point;
}

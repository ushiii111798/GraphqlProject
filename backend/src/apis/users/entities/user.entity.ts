import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'char', length: 100 })
  @Field(() => String)
  loginId: string;

  @Column({ type: 'varchar', length: 100 })
  // @Field(() => String)
  loginPass: string;

  @Column({ type: 'varchar', length: 20 })
  @Field(() => String)
  name: string;

  @Column({ type: 'date', nullable: true })
  @Field(() => Date, { nullable: true })
  birth: Date;

  @Column({ type: 'char', length: 4, nullable: true })
  @Field(() => String, { nullable: true })
  sex: string;

  @Column({ type: 'varchar', length: 20 })
  @Field(() => String)
  grade: string;

  @Column({ type: 'int', default: 0, nullable: true })
  @Field(() => Int, { nullable: true })
  pointTotal: number;

  @Column({ type: 'varchar', length: 150, nullable: true })
  @Field(() => String, { nullable: true })
  email: string;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  isAgreedEmail: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  assignedAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  optoutAt: Date;

  // @JoinTable()
  // @ManyToMany(() => Coupon, (coupons) => coupons.users)
  // coupons: Coupon[];
}

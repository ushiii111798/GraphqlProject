import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum POINT_STATUS_ENUM {
  CREDIT = 'CREDIT',
  CANCEL = 'CANCEL',
  USED = 'USED',
}
registerEnumType(POINT_STATUS_ENUM, {
  name: 'POINT_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Point {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @Field(() => String)
  name: string;

  @Column({ type: 'int' })
  @Field(() => Number)
  point: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: POINT_STATUS_ENUM,
    default: POINT_STATUS_ENUM.CREDIT,
  })
  @Field(() => POINT_STATUS_ENUM)
  status: string;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}

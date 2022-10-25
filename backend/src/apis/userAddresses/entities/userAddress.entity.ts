import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum USER_ADDRESS_TYPE_ENUM {
  HOME = 'HOME',
  WORK = 'WORK',
  EXTRA = 'EXTRA',
}
registerEnumType(USER_ADDRESS_TYPE_ENUM, {
  name: 'USER_ADDRESS_TYPE_ENUM',
});

@Entity()
@ObjectType()
export class UserAddress {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 300 })
  @Field(() => String)
  address: string;

  @Column({ type: 'varchar', length: 300 })
  @Field(() => String)
  detailAddress: string;

  @Column({ type: 'varchar', length: 10 })
  @Field(() => String)
  zipCode: string;

  @Column({ type: 'enum', enum: USER_ADDRESS_TYPE_ENUM })
  @Field(() => USER_ADDRESS_TYPE_ENUM)
  userAddressType: string;

  @Column({ type: 'varchar', length: 50 })
  @Field(() => String)
  userAddressName: string;

  @Column({ type: 'boolean' })
  isMain: boolean;

  @ManyToOne(() => User)
  user: User;
}

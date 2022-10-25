import { Field, InputType } from '@nestjs/graphql';
import { USER_ADDRESS_TYPE_ENUM } from '../entities/userAddress.entity';

@InputType()
export class CreateUserAddressInput {
  @Field(() => String)
  address: string;

  @Field(() => String)
  detailAddress: string;

  @Field(() => String)
  zipCode: string;

  @Field(() => USER_ADDRESS_TYPE_ENUM)
  userAddressType: string;

  @Field(() => String)
  userAddressName: string;

  @Field(() => Boolean)
  isMain: boolean;
}

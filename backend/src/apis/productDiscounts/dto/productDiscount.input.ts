import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ProductDiscountsInput {
  @Field(() => String)
  name: string;

  @Field(() => Int)
  price: number;
}

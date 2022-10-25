import { Field, InputType, Int } from '@nestjs/graphql';
import { Min } from 'class-validator';

@InputType()
export class CreateProductWithImageURLInput {
  @Field(() => String)
  name: string;

  @Min(0)
  @Field(() => Int)
  price: number;

  @Field(() => Int, { defaultValue: 0 })
  deliveryPrice: number;

  @Field(() => Int, { defaultValue: 10 })
  maxQ: number;

  @Field(() => String)
  detailText: string;

  @Min(0)
  @Field(() => Int)
  stock: number;

  @Field(() => String)
  productCategoriesId: string;

  @Field(() => String, { nullable: true })
  productDiscountsId: string;

  @Field(() => [String], { nullable: true })
  images: string[];
}

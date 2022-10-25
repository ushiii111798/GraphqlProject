import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  loginId: string;

  @Field(() => String)
  loginPass: string;

  @Field(() => String)
  name: string;

  @Field(() => Date)
  birth: Date;

  @Field(() => String)
  sex: string;

  @Field(() => String)
  grade: string;

  @Field(() => String)
  email: string;

  @Field(() => Boolean)
  isAgreedEmail: boolean;
}

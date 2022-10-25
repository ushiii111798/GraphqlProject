import { Field, InputType } from '@nestjs/graphql';
import { BoardList } from 'src/apis/boardLists/entities/boardList.entity';

@InputType()
export class CreateBoardWithImageURLInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => Boolean)
  isSecret: boolean;

  @Field(() => String)
  boardLists: string;

  @Field(() => String)
  password: string;

  @Field(() => [String], { nullable: true })
  images: string[];
}

import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { BoardList } from 'src/apis/boardLists/entities/boardList.entity';

@InputType()
export class CreateBoardInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => Boolean)
  isSecret: boolean;

  @Field(() => String)
  boardLists: string;

  @Field(() => String, {
    nullable: true,
    description: 'If isSecret is set to true, password must be provided',
  })
  password: string;

  @Field(() => [GraphQLUpload], { nullable: true })
  images: FileUpload[];
}

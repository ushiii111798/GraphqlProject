import { InputType, PartialType } from '@nestjs/graphql';
import { CreateBoardWithImageURLInput } from './createBoardWithImageURL.input';

@InputType()
export class UpdateBoardWithImageURLInput extends PartialType(
  CreateBoardWithImageURLInput,
) {}

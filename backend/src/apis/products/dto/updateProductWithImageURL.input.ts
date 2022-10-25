import { InputType, PartialType } from '@nestjs/graphql';
import { CreateProductWithImageURLInput } from './createProductWithImageURL.input';

@InputType()
export class UpdateProductWithImageURLInput extends PartialType(
  CreateProductWithImageURLInput,
) {}

//PartialType : Use all col, isNotRequired

//PickType : Use selected col
// PickType(ClassName, ["col", "col"])

//OmitType : Use all col except some
// OmitType(ClassName, ["col"])

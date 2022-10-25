import { CreateProductInput } from './createProduct.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {}

//PartialType : Use all col, isNotRequired

//PickType : Use selected col
// PickType(ClassName, ["col", "col"])

//OmitType : Use all col except some
// OmitType(ClassName, ["col"])

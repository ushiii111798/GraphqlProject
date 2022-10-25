import { ProductCategoriesService } from './productCategories.service';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductCategory } from './entities/productCategory.entity';

@Resolver()
export class ProductCategoriesResolver {
  constructor(
    private readonly productCategoriesService: ProductCategoriesService,
  ) {}

  @Mutation(() => ProductCategory)
  createProductCategory(@Args('category') category: string) {
    return this.productCategoriesService.create({ category });
  }
}

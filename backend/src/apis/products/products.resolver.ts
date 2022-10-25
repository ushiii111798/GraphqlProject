import { CreateProductWithImageURLInput } from './dto/createProductWithImageURL.input';
import { UpdateProductInput } from './dto/updateProduct.input';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateProductInput } from './dto/createProduct.input';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { UpdateProductWithImageURLInput } from './dto/updateProductWithImageURL.input';

@Resolver()
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => Product)
  fetchProduct(@Args('productId') productId: string) {
    return this.productsService.findOne({ productId });
  }

  @Query(() => [Product])
  async fetchProducts(@Args('search') search: string) {
    const result = await this.productsService.findCache({ search });
    if (result !== null) {
      return result;
    }
    return this.productsService.search({ search });
  }

  @Query(() => [Product])
  fetchProductsWithDeleted() {
    return this.productsService.findAllWithDeleted();
  }

  @Mutation(() => Product)
  createProduct(
    @Args({ name: 'createProductInput', nullable: true })
    createProductInput: CreateProductInput,
  ) {
    return this.productsService.create({ createProductInput });
  }

  @Mutation(() => Product)
  createProductWithImageURL(
    @Args({ name: 'createProductInput', nullable: true })
    createProductInput: CreateProductWithImageURLInput,
  ) {
    return this.productsService.create({ createProductInput });
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('productId') productId: string,
    @Args('updateProductInput') updateProductInput: UpdateProductInput,
  ) {
    await this.productsService.checkSoldout({ productId });

    return this.productsService.update({ productId, updateProductInput });
  }

  @Mutation(() => Product)
  async updateProductWithImageURL(
    @Args('productId') productId: string,
    @Args('updateProductInput')
    updateProductInput: UpdateProductWithImageURLInput,
  ) {
    await this.productsService.checkSoldout({ productId });

    return this.productsService.update({ productId, updateProductInput });
  }

  @Mutation(() => Boolean)
  deleteProduct(@Args('productId') productId: string) {
    return this.productsService.delete({ productId });
  }

  @Mutation(() => Boolean)
  restoreProduct(@Args('productId') productId: string) {
    return this.productsService.restore({ productId });
  }

  @Mutation(() => Boolean)
  hardDeleteProduct(@Args('productId') productId: string) {
    return this.productsService.hardDelete({ productId });
  }
}

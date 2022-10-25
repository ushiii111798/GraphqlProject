import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategoriesService } from './productCategories.service';
import { ProductCategoriesResolver } from './productCategories.resolver';
import { Module } from '@nestjs/common';
import { ProductCategory } from './entities/productCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  providers: [ProductCategoriesResolver, ProductCategoriesService],
})
export class ProductCategoriesModule {}

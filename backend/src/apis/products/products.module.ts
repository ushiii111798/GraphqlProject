import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
// import { ProductDiscount } from '../productDiscounts/entities/productDiscount.entity';
import { Image } from '../images/entities/image.entity';
import { ProductCategory } from '../productCategories/entities/productCategory.entity';
import { ImagesService } from '../images/images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductCategory, Image]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [ProductsResolver, ProductsService, ImagesService],
})
export class ProductsModule {}

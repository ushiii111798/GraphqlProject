import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './entities/productCategory.entity';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoriesRepository: Repository<ProductCategory>,
  ) {}

  async create({ category }) {
    const result = await this.productCategoriesRepository.save({ category });
    return result;
  }
}

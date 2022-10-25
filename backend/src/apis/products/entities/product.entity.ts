import { ProductCategory } from '../../productCategories/entities/productCategory.entity';
import { ProductDiscount } from '../../productDiscounts/entities/productDiscount.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType, Int } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @Field(() => String)
  name: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  price: number;

  @Column({ type: 'int' })
  @Field(() => Int)
  deliveryPrice: number;

  @Column({ type: 'int' })
  maxQ: number;

  @Column({ type: 'text' })
  @Field(() => String)
  detailText: string;

  @Column({ type: 'int' })
  @Field(() => Int)
  stock: number;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @ManyToOne(() => ProductDiscount, { nullable: true })
  @Field(() => ProductDiscount, { nullable: true })
  productDiscounts: ProductDiscount;

  @ManyToOne(() => ProductCategory, { nullable: true })
  @Field(() => ProductCategory, { nullable: true })
  productCategories: ProductCategory;
}

import { Field, ObjectType } from '@nestjs/graphql/dist/decorators';
import { Board } from 'src/apis/boards/entities/board.entity';
import { Product } from 'src/apis/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 500 })
  @Field(() => String)
  image: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @Field(() => String, { nullable: true })
  thumbnailSmall: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @Field(() => String, { nullable: true })
  thumbnailMedium: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @Field(() => String, { nullable: true })
  thumbnailLarge: string;

  @Column({ type: 'boolean', default: false })
  @Field(() => Boolean)
  isMain: boolean;

  @ManyToOne(() => Board, { nullable: true })
  board: Board;

  @ManyToOne(() => Product, { nullable: true })
  product: Product;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;
}

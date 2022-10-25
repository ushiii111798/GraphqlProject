import { User } from '../../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { BoardList } from 'src/apis/boardLists/entities/boardList.entity';
import { Image } from 'src/apis/images/entities/image.entity';

@Entity()
@ObjectType()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'varchar', length: 100 })
  @Field(() => String)
  title: string;

  @Column({ type: 'text' })
  @Field(() => String)
  content: string;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field(() => Date, { nullable: true })
  updatedAt: Date;

  @DeleteDateColumn()
  @Field(() => Date, { nullable: true })
  deletedAt: Date;

  @Column({ type: 'boolean' })
  @Field(() => Boolean)
  isSecret: boolean;

  @Column({ type: 'varchar', length: 50 })
  password: string;

  @ManyToOne(() => BoardList)
  @Field(() => BoardList)
  boardLists: BoardList;

  @ManyToOne(() => User)
  @Field(() => User)
  users: User;

  @Field(() => [Image], { nullable: true })
  images: Image[];
}

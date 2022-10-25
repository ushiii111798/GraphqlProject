import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class BoardList {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { nullable: true })
  id: string;

  @Column({ type: 'varchar', length: 50 })
  @Field(() => String, { nullable: true })
  title: string;
}

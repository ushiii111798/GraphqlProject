import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Board } from './entities/board.entity';
import { BoardsResolver } from './boards.resolver';
import { BoardsService } from './boards.service';
import { ImagesService } from '../images/images.service';
import { Image } from '../images/entities/image.entity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board, Image]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [BoardsResolver, BoardsService, ImagesService],
})
export class BoardsModule {}

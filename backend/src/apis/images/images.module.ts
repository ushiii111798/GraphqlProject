import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesResolver } from './images.resolver';
import { ImagesService } from './images.service';
import { Image } from './entities/image.entity';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    ElasticsearchModule.register({
      node: 'http://elasticsearch:9200',
    }),
  ],
  providers: [ImagesResolver, ImagesService],
})
export class ImagesModule {}

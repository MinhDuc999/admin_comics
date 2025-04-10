import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComicsController } from './comics.controller';
import { ComicsService } from './comics.service';
import { ComicRepository } from './repositories/comic.repository';
import { ComicEntity } from './entities/comic.entity';
import { DetailComicEntity } from './entities/detail-comic.entity';
import { DetailComicsService } from './detail-comics.service';
import { DetailComicRepository } from './repositories/detail-comic.repository';
import { DetailComicsController } from './detail-comics.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ComicEntity, DetailComicEntity])],
  controllers: [ComicsController, DetailComicsController],
  providers: [
    ComicsService,
    ComicRepository,
    DetailComicsService,
    DetailComicRepository,
  ],
})
export class ComicsModule {}

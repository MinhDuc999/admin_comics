import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { DetailComicsService } from './detail-comics.service';
import { DetailComicDto } from './dto/detail-comic.dto';

@Controller('detail_comics')
export class DetailComicsController {
  constructor(private detailComicsService: DetailComicsService) {}

  @Post()
  async createDetailComic(@Body() detailComicDto: DetailComicDto) {
    return this.detailComicsService.createDetailComic(detailComicDto);
  }

  @Get()
  async getAllDetailComics() {
    return this.detailComicsService.getAllDetailComics();
  }

  @Get(':id')
  async getDetailComicById(@Param('id', ParseIntPipe) id: number) {
    return this.detailComicsService.getDetailComicById(id);
  }

  @Put(':id')
  async updateDetailComic(
    @Param('id', ParseIntPipe) id: number,
    @Body() detailComicDto: DetailComicDto,
  ) {
    return this.detailComicsService.updateDetailComic(id, detailComicDto);
  }

  @Delete(':id')
  async deleteDetailComic(@Param('id', ParseIntPipe) id: number) {
    return this.detailComicsService.deleteDetailComic(id);
  }
}

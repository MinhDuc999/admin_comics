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
import { ComicsService } from './comics.service';
import { ComicDto } from './dto/comic.dto';

@Controller('comics')
export class ComicsController {
  constructor(private comicsService: ComicsService) {}

  @Post()
  async createComic(@Body() comicDto: ComicDto) {
    return this.comicsService.createComic(comicDto);
  }

  @Get()
  async getAllComics() {
    return this.comicsService.getAllComics();
  }

  @Get(':id')
  async getComicById(@Param('id', ParseIntPipe) id: number) {
    return this.comicsService.getComicById(id);
  }

  @Put(':id')
  async updateComic(
    @Param('id', ParseIntPipe) id: number,
    @Body() comicDto: ComicDto,
  ) {
    return this.comicsService.updateComic(id, comicDto);
  }

  @Delete(':id')
  async deleteComic(@Param('id', ParseIntPipe) id: number) {
    return this.comicsService.deleteComic(id);
  }
}

import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ComicEntity } from '../entities/comic.entity';
import { ComicDto } from '../dto/comic.dto';

@Injectable()
export class ComicRepository extends Repository<ComicEntity> {
  constructor(private dataSource: DataSource) {
    super(ComicEntity, dataSource.createEntityManager());
  }

  async createComic(comicDto: ComicDto): Promise<ComicEntity> {
    const comic = this.create(comicDto);
    return await this.save(comic);
  }

  async getAllComics(): Promise<ComicEntity[]> {
    return (await this.find()) || [];
  }

  async getComicById(id: number): Promise<ComicEntity | null> {
    return await this.findOne({
      where: { id },
      relations: ['detailComics'],
    });
  }

  async updateComic(
    id: number,
    comicDto: ComicDto,
  ): Promise<ComicEntity | null> {
    const result = await this.update(id, comicDto);
    if (result.affected && result.affected > 0) {
      return this.findOne({ where: { id } });
    }
    return null;
  }

  async deleteComic(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}

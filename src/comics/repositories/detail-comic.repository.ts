import { Repository, DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DetailComicEntity } from '../entities/detail-comic.entity';
import { DetailComicDto } from '../dto/detail-comic.dto';

@Injectable()
export class DetailComicRepository extends Repository<DetailComicEntity> {
  constructor(private dataSource: DataSource) {
    super(DetailComicEntity, dataSource.createEntityManager());
  }

  async createDetailComic(
    detailComicDto: DetailComicDto,
  ): Promise<DetailComicEntity> {
    const detailComic = this.create(detailComicDto);
    return await this.save(detailComic);
  }

  async getAllDetailComics(): Promise<DetailComicEntity[]> {
    return (
      (await this.find({
        relations: ['comic'],
      })) || []
    );
  }

  async getDetailComicById(id: number): Promise<DetailComicEntity | null> {
    return await this.findOne({
      where: { id },
      relations: ['comic'],
    });
  }

  async updateDetailComic(
    id: number,
    detailComicDto: DetailComicDto,
  ): Promise<DetailComicEntity | null> {
    const result = await this.update(id, detailComicDto);
    if (result.affected && result.affected > 0) {
      return this.findOne({
        where: { id },
        relations: ['comic'],
      });
    }
    return null;
  }

  async deleteDetailComic(id: number): Promise<boolean> {
    const result = await this.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}

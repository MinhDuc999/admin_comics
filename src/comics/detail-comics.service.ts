import { Injectable } from '@nestjs/common';
import { DetailComicRepository } from './repositories/detail-comic.repository';
import { DetailComicDto } from './dto/detail-comic.dto';
import { DetailComicEntity } from './entities/detail-comic.entity';
import { ResponseData } from '../common/global';

@Injectable()
export class DetailComicsService {
  constructor(private readonly detailComicRepository: DetailComicRepository) {}

  async createDetailComic(
    detailComicDto: DetailComicDto,
  ): Promise<ResponseData<DetailComicEntity>> {
    try {
      const detailComic =
        await this.detailComicRepository.createDetailComic(detailComicDto);
      return {
        statusCode: 200,
        message: 'Detail comic created successfully',
        error: null,
        data: detailComic,
      };
    } catch (error) {
      return {
        statusCode: 404,
        message: 'Failed to create detail comic',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async getAllDetailComics(): Promise<ResponseData<DetailComicEntity[]>> {
    try {
      const detailComics =
        await this.detailComicRepository.getAllDetailComics();
      return {
        statusCode: 200,
        message: 'Detail comics retrieved successfully',
        error: null,
        data: detailComics,
      };
    } catch (error) {
      return {
        statusCode: 404,
        message: 'Failed to retrieve detail comics',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [],
      };
    }
  }

  async getDetailComicById(
    id: number,
  ): Promise<ResponseData<DetailComicEntity>> {
    try {
      const detailComic =
        await this.detailComicRepository.getDetailComicById(id);

      if (!detailComic) {
        return {
          statusCode: 404,
          message: 'Detail comic not found',
          error: 'No detail comic found with the given ID',
          data: null,
        };
      }

      return {
        statusCode: 200,
        message: 'Detail comic retrieved successfully',
        error: null,
        data: detailComic,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error retrieving detail comic',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async updateDetailComic(
    id: number,
    detailComicDto: DetailComicDto,
  ): Promise<ResponseData<DetailComicEntity>> {
    try {
      const detailComic = await this.detailComicRepository.updateDetailComic(
        id,
        detailComicDto,
      );

      if (!detailComic) {
        return {
          statusCode: 404,
          message: 'Detail comic not found',
          error: 'No detail comic found with the given ID',
          data: null,
        };
      }

      return {
        statusCode: 200,
        message: 'Detail comic updated successfully',
        error: null,
        data: detailComic,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to update detail comic',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async deleteDetailComic(id: number): Promise<ResponseData<boolean>> {
    try {
      const result = await this.detailComicRepository.deleteDetailComic(id);

      if (!result) {
        return {
          statusCode: 404,
          message: 'Detail comic not found',
          error: 'No detail comic found with the given ID',
          data: false,
        };
      }

      return {
        statusCode: 200,
        message: 'Detail comic deleted successfully',
        error: null,
        data: true,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to delete detail comic',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: false,
      };
    }
  }
}

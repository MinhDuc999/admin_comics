import { Injectable } from '@nestjs/common';
import { ComicRepository } from './repositories/comic.repository';
import { ComicDto } from './dto/comic.dto';
import { ComicEntity } from './entities/comic.entity';
import { ResponseData } from '../common/global';

@Injectable()
export class ComicsService {
  constructor(private readonly comicRepository: ComicRepository) {}

  async createComic(comicDto: ComicDto): Promise<ResponseData<ComicEntity>> {
    try {
      const comic = await this.comicRepository.createComic(comicDto);
      return {
        statusCode: 200,
        message: 'Comic created successfully',
        error: null,
        data: comic,
      };
    } catch (error) {
      return {
        statusCode: 404,
        message: 'Failed to create comic',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async getAllComics(): Promise<ResponseData<ComicEntity[]>> {
    try {
      const comics = await this.comicRepository.getAllComics();
      return {
        statusCode: 200,
        message: 'Comics retrieved successfully',
        error: null,
        data: comics,
      };
    } catch (error) {
      return {
        statusCode: 404,
        message: 'Failed to retrieve comics',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [],
      };
    }
  }

  async getComicById(id: number): Promise<ResponseData<ComicEntity>> {
    try {
      const comic = await this.comicRepository.getComicById(id);

      if (!comic) {
        return {
          statusCode: 404,
          message: 'Comic not found',
          error: 'No comic found with the given ID',
          data: null,
        };
      }

      return {
        statusCode: 200,
        message: 'Comic retrieved successfully',
        error: null,
        data: comic,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error retrieving comic',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async updateComic(
    id: number,
    comicDto: ComicDto,
  ): Promise<ResponseData<ComicEntity>> {
    try {
      const comic = await this.comicRepository.updateComic(id, comicDto);

      if (!comic) {
        return {
          statusCode: 404,
          message: 'Comic not found',
          error: 'No comic found with the given ID',
          data: null,
        };
      }

      return {
        statusCode: 200,
        message: 'Comic updated successfully',
        error: null,
        data: comic,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to update comic',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      };
    }
  }

  async deleteComic(id: number): Promise<ResponseData<boolean>> {
    try {
      const result = await this.comicRepository.deleteComic(id);

      if (!result) {
        return {
          statusCode: 404,
          message: 'Comic not found',
          error: 'No comic found with the given ID',
          data: false,
        };
      }

      return {
        statusCode: 200,
        message: 'Comic deleted successfully',
        error: null,
        data: true,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Failed to delete comic',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: false,
      };
    }
  }
}

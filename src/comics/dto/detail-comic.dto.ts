import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class DetailComicDto {
  @IsOptional()
  @IsNumber()
  comicId?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sourceRead?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sourceAudio?: string[];
}

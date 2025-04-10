import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class ComicDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  author?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsBoolean()
  favorite?: boolean;

  @IsOptional()
  @IsNumber()
  star?: number;
}

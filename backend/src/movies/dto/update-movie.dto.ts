import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class UpdateMovieDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear() + 5)
  @IsOptional()
  publishing_year?: number;

  @IsString()
  @IsOptional()
  poster?: string;
}


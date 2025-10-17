import { IsString, IsInt, Min, Max } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsInt()
  @Min(1800)
  @Max(new Date().getFullYear() + 5)
  publishing_year: number;
}


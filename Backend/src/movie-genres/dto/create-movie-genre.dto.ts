import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateMovieGenreDto {

  @IsNotEmpty()
  @IsInt()
  idMovie: number;

  @IsNotEmpty()
  @IsInt()
  idGenre: number;
}
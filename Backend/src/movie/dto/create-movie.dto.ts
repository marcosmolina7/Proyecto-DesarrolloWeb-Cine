import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMovieDto {

  @IsString()
  @IsNotEmpty()
  nameMovie: string;

  @IsNumber()
  @IsNotEmpty()
  durationMovie: number;

  @IsString()
  @IsNotEmpty()
  synapsisMovie: string;
  
  @IsDateString()
  @IsNotEmpty()
  realseDateMovie: string;

  @IsString()
  @IsNotEmpty()
  posterMovie: string;

  @IsNumber()
  @IsNotEmpty()
  idDirector: number;

  @IsNumber()
  @IsNotEmpty()
  idAgeRating: number;

}

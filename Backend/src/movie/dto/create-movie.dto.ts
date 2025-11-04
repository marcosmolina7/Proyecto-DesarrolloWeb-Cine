import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

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
  
  @IsString()
  @IsNotEmpty()
  realseDateMovie: string;

  @IsString()
  @IsNotEmpty()
  posterMovie: string;

  @IsBoolean()
  @IsNotEmpty()
  stateMovie: boolean;

  @IsNumber()
  @IsNotEmpty()
  idDirector: number;

  @IsNumber()
  @IsNotEmpty()
  idAgeRating: number;

}

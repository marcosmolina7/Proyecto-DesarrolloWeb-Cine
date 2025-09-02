import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAgeRatingDto {

  @IsString()
  @IsNotEmpty()
  nameAgeRating: string;

  @IsString()
  @IsNotEmpty()
  descAgeRating: string;

}
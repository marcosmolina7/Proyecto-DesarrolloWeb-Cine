import { IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateShowtimeDto {
  
  @IsNotEmpty()
  @IsDateString()
  dateTimeShowtime: Date;

  @IsNotEmpty()
  @IsInt()
  idRoom: number;

  @IsNotEmpty()
  @IsInt()
  idMovie: number;
}
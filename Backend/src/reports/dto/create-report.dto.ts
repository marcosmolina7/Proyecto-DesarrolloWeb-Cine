import { IsInt, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateReportDto {

  @IsNotEmpty()
  @IsDateString()
  dateReport: string;

  @IsNotEmpty()
  @IsString()
  typeReport: string;

  @IsNotEmpty()
  @IsString()
  parametersReport: string;

  @IsNotEmpty()
  @IsInt()
  idUser: number;
}
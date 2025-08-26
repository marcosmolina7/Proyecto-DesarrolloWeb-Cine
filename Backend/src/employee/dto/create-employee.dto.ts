import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEmployeeDto {

  @IsString()
  @IsNotEmpty()
  namesEmployee: string;

  @IsString()
  @IsNotEmpty()
  lastNamesEmployee: string;

  @IsString()
  @IsNotEmpty()
  phoneEmployee: string;

  @IsDateString()
  @IsNotEmpty()
  birthdayEmployee: string;

  @IsBoolean()
  stateEmployee: boolean;

  @IsNumber()
  @IsNotEmpty()
  idUser: number;
}

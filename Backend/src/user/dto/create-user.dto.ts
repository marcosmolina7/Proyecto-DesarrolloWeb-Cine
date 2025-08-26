import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  nameUser: string;

  @IsString()
  @IsNotEmpty()
  passUser: string;

  @IsNumber()
  @IsNotEmpty()
  idRole: number;

}

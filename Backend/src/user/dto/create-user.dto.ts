import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto {

  @IsEmail()
  @IsNotEmpty()
  nameUser: string;

  @IsString()
  @IsNotEmpty()
  passUser: string;

  @IsNumber()
  @IsNotEmpty()
  idRole: number;

}

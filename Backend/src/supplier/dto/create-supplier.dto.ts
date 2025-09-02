import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSupplierDto {

  @IsString()
  @IsNotEmpty()
  nameSupplier: string;

  @IsString()
  @IsNotEmpty()
  contactPersonSupplier: string;

  @IsString()
  @IsNotEmpty()
  phoneSupplier: string;

  @IsEmail()
  @IsNotEmpty()
  emailSupplier: string;

  @IsString()
  @IsOptional()
  addressSupplier: string;

}

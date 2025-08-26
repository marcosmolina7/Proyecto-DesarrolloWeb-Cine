import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateRoleDto {

  @IsString()
  @IsNotEmpty()
  nameRole: string;

  @IsString()
  @IsOptional()
  descriptionRole: string;
  
}

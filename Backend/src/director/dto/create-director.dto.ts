import { IsNotEmpty, IsString } from "class-validator";

export class CreateDirectorDto {

  @IsString()
  @IsNotEmpty()
  nameDirector: string;

}

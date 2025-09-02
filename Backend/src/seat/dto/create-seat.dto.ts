import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSeatDto {

  @IsString()
  @IsNotEmpty()
  rowSeat: string;

  @IsNumber()
  @IsNotEmpty()
  columnSeat: number;

  @IsString()
  @IsNotEmpty()
  stateSeat: string;
  
  @IsNumber()
  @IsOptional()
  idRoom: number;

}

// src/room/dto/assign-seats.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsArray } from "class-validator";

export class AssignSeatsDto {
  @IsNumber()
  @IsNotEmpty()
  idRoom: number;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  seats: string[];
}
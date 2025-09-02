// src/room/dto/create-room.dto.ts

import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateRoomDto {

  @IsString()
  @IsNotEmpty()
  nameRoom: string;

  @IsNumber()
  @IsNotEmpty()
  rows: number;

  @IsNumber()
  @IsNotEmpty()
  columns: number;
}
// src/seat/dto/create-bulk-seats.dto.ts
import { IsInt, Min } from 'class-validator';

export class CreateBulkSeatsDto {
  @IsInt()
  @Min(1)
  rows: number;

  @IsInt()
  @Min(1)
  columns: number;
}
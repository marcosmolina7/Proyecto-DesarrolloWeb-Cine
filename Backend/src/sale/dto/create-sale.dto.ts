// src/sale/dto/create-sale.dto.ts
import { IsNumber, IsPositive, IsNotEmpty} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSaleDto {
  
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  totalSale: number; 
}


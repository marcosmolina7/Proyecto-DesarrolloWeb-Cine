import { IsNotEmpty, IsInt, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchasesItemDto {
  
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  idPurchase: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  idProduct: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  costPrice: number;
}
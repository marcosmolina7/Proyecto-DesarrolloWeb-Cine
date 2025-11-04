import { IsNotEmpty, IsInt, IsNumber, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePurchaseDto {
  
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  idSupplier: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  idUser: number;

  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  totalAmount: number; // Monto total de la factura o compra
}
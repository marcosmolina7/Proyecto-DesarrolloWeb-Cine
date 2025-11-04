import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateProductsSaleDto {

  @IsNotEmpty()
  @IsInt()
  idSale: number;

  @IsNotEmpty()
  @IsInt()
  idProduct: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  unitPrice: number;
}
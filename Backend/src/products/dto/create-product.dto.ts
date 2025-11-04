import { IsInt, IsNotEmpty, IsString, IsNumber, IsPositive, Min, IsBoolean, IsOptional } from 'class-validator';

export class CreateProductDto {

  @IsNotEmpty()
  @IsString()
  nameProduct: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  priceProduct: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stockProduct: number;

  @IsOptional()
  @IsBoolean()
  stateProduct?: boolean;

  @IsNotEmpty()
  @IsInt()
  idCategorie: number;

  @IsNotEmpty()
  @IsInt()
  idSize: number;
}
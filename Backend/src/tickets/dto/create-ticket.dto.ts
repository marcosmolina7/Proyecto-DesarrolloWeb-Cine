import { IsInt, IsNotEmpty, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class CreateTicketDto {

  @IsNotEmpty()
  @IsInt()
  idSeat: number;

  @IsNotEmpty()
  @IsInt()
  idRoom: number;
  
  @IsNotEmpty()
  @IsInt()
  idShowtime: number;

  @IsNotEmpty()
  @IsInt()
  idSale: number; 

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  priceTicket: number;

  @IsOptional()
  @IsInt()
  idUser?: number;
}
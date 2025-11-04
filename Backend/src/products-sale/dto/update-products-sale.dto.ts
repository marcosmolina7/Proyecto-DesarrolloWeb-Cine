import { PartialType } from '@nestjs/swagger';
import { CreateProductsSaleDto } from './create-products-sale.dto';

export class UpdateProductsSaleDto extends PartialType(CreateProductsSaleDto) {}

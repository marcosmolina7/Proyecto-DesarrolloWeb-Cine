import { PartialType } from '@nestjs/swagger';
import { CreatePurchasesItemDto } from './create-purchases-item.dto';

export class UpdatePurchasesItemDto extends PartialType(CreatePurchasesItemDto) {}

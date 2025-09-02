import { PartialType } from '@nestjs/swagger';
import { CreateAgeRatingDto } from './create-age-rating.dto';

export class UpdateAgeRatingDto extends PartialType(CreateAgeRatingDto) {}

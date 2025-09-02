import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put } from '@nestjs/common';
import { AgeRatingService } from './age-rating.service';
import { CreateAgeRatingDto } from './dto/create-age-rating.dto';
import { UpdateAgeRatingDto } from './dto/update-age-rating.dto';

@Controller('age-rating')
export class AgeRatingController {

  constructor(private readonly ageRatingService: AgeRatingService) {}

  @Get()
  async getAllAgeRatings () {
    return this.ageRatingService.getAllAgeRatings();
  }

  @Get(':id')
  async getAgeRatingById (@Param('id') id: string) {
    return this.ageRatingService.getAgeRatigById(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createAgeRating (@Body() data: CreateAgeRatingDto) {
    return this.ageRatingService.createAgeRating(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateAgeRating (@Param('id') id: string, @Body() data: UpdateAgeRatingDto) {
    return this.ageRatingService.updateAgeRating(Number(id), data);
  }

  @Delete(':id')
  async deleteAgeRating (@Param('id') id: string) {
    return this.ageRatingService.deleteAgeRating(Number(id));
  }

}

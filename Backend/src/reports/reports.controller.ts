import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, Put, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {

  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getAllReports () {
    return this.reportsService.getAllReports();
  }

  @Get(':id')
  async getReportById (@Param('id') id: string) {
    return this.reportsService.getReportById(Number(id));
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createReport (@Body() data: CreateReportDto) {
    return this.reportsService.createReport(data);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async updateReport (@Param('id') id: string, @Body() data: UpdateReportDto) {
    return this.reportsService.updateReport(Number(id), data);
  }

  @Delete(':id')
  async deleteReport (@Param('id') id: string) {
    return this.reportsService.deleteReport(Number(id));
  }
  
  @Get('generate/:id')
  async generateReportPdf(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.reportsService.generatePdf(Number(id));

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=reporte_${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });
    
    res.end(pdfBuffer);
  }
}
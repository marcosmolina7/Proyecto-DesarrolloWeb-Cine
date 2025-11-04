import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { Reports } from 'generated/prisma';
import { UpdateReportDto } from './dto/update-report.dto';
import { PdfGeneratorService } from 'src/pdf-generator/pdf-generator.service';

@Injectable()
export class ReportsService {
  
  constructor (private prisma: PrismaService, private pdfService: PdfGeneratorService) {}

  async getAllReports(): Promise<Reports[]> {
    return this.prisma.reports.findMany({ include: { user: { select: { idUser: true, nameUser: true } } }, orderBy: { idReport: 'desc' }, });
  }

  async getReportById(idReport: number): Promise<Reports> {
    const reportFound = await this.prisma.reports.findUnique({ where: { idReport } });
    if (!reportFound) throw new NotFoundException(`Report with ID ${idReport} does not exist.`);
    return reportFound;
  }

  async createReport(data: CreateReportDto): Promise<Reports> {
    const { idUser } = data;

    if (!(await this.prisma.user.findUnique({ where: { idUser } }))) throw new NotFoundException(`User with ID ${idUser} does not exist.`);
    
    return this.prisma.reports.create({ data: { ...data, dateReport: new Date(data.dateReport) } });
  }

  async updateReport(idReport: number, data: UpdateReportDto): Promise<Reports> {
    const reportFound = await this.prisma.reports.findUnique({ where: { idReport } });
    if (!reportFound) throw new NotFoundException(`Report with ID ${idReport} does not exist.`);
    
    if (data.idUser) {
        const user = await this.prisma.user.findUnique({ where: { idUser: data.idUser } });
        if (!user) {
            throw new NotFoundException(`User with ID ${data.idUser} does not exist.`);
        }
    }
    
    const dataToUpdate = data.dateReport ? { ...data, dateReport: new Date(data.dateReport) } : data;

    return this.prisma.reports.update({ where: { idReport }, data: dataToUpdate });
  }

  async deleteReport(idReport: number): Promise<Reports> {
    const reportFound = await this.prisma.reports.findUnique({ where: { idReport } });
    if (!reportFound) throw new NotFoundException(`Report with ID ${idReport} does not exist.`);
    return this.prisma.reports.delete({ where: { idReport } });
  }

  async generatePdf(idReport: number): Promise<Buffer> {
    const reportData = await this.prisma.reports.findUnique({ where: { idReport } });
    if (!reportData) throw new NotFoundException(`Report with ID ${idReport} does not exist.`);
    
    return this.pdfService.generateReportPdf(reportData);
  }
}
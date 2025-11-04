import { Injectable } from '@nestjs/common';
const PDFDocument = require('pdfkit');

@Injectable()
export class PdfGeneratorService {

  async generateReportPdf(reportData: any): Promise<Buffer> {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});


    doc.fontSize(18).text(`Reporte de Sistema`, { align: 'center' });
    doc.moveDown();

    // Información del Reporte
    doc.fontSize(12).text(`Tipo de Reporte: ${reportData.typeReport}`, { continued: true }).text(`ID: ${reportData.idReport}`);
    doc.text(`Fecha: ${new Date(reportData.dateReport).toLocaleDateString()}`);
    doc.text(`Generado por ID Usuario: ${reportData.idUser}`);
    doc.moveDown();

    // Parámetros
    doc.fontSize(14).text('Parámetros Utilizados:', { underline: true });
    doc.fontSize(10).text(reportData.parametersReport);
    doc.moveDown();

    doc.end();

    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
    });
  }
}
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { EscalaLinha } from '../types/escala.types';
import { gerarIntervaloPorTurno } from './turno';

interface GerarPdfEscalaParams {
  posto: string;
  dataExtenso: string;
  linhas: EscalaLinha[];
}

const nomeArquivoSeguro = (posto: string): string => {
  const slug = posto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `escala-${slug || 'posto'}.pdf`;
};

export const gerarPdfEscala = ({ posto, dataExtenso, linhas }: GerarPdfEscalaParams) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  doc.setFontSize(20);
  doc.text('Gestao de Escala', 40, 50);

  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(`Posto: ${posto}`, 40, 74);
  doc.text(`Data: ${dataExtenso}`, 40, 92);

  const linhasTabela = linhas.map((linha) => {
    return [
      linha.horario || gerarIntervaloPorTurno(linha.turno),
      `Al ${linha.aluno}`,
      linha.quarto ?? '-',
      linha.cama ?? '-',
      String(linha.nr),
    ];
  });

  autoTable(doc, {
    startY: 120,
    head: [['Horario', 'Aluno', 'Quarto', 'Cama', 'NR']],
    body:
      linhasTabela.length > 0
        ? linhasTabela
        : [['-', 'Nenhuma escala configurada para este posto', '-', '-', '-']],
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 8,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 95 },
      1: { cellWidth: 230 },
      2: { cellWidth: 70 },
      3: { cellWidth: 70 },
      4: { cellWidth: 55 },
    },
  });

  doc.save(nomeArquivoSeguro(posto));
};
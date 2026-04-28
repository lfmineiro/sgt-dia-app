import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { EscalaLinha } from '../../../types/escala.types';
import { gerarIntervaloPorTurno } from './turno';

interface GerarPdfEscalaParams {
  posto: string;
  dataExtenso: string;
  linhas: EscalaLinha[];
}

type LinhaTabelaPdf = [string, string, string, string, string];

const nomeArquivoSeguro = (posto: string): string => {
  const slug = posto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `escala-${slug || 'posto'}.pdf`;
};

const quebrarIntervalos = (linha: EscalaLinha): string[] => {
  const horarioBase = linha.horario || gerarIntervaloPorTurno(linha.turno);

  if (!horarioBase) {
    return ['-'];
  }

  const intervalos = horarioBase
    .split('|')
    .map((trecho) => trecho.trim())
    .filter(Boolean);

  return intervalos.length > 0 ? intervalos : [horarioBase];
};

const montarLinhaPdf = (linha: EscalaLinha, horario: string): LinhaTabelaPdf => {
  return [
    horario,
    `Al ${linha.aluno}`,
    linha.quarto ?? '-',
    linha.cama ?? '-',
    String(linha.nr),
  ];
};

const montarLinhasTabelaPorHorario = (linhas: EscalaLinha[]): LinhaTabelaPdf[] => {
  const linhasOrdenadas = [...linhas].sort((a, b) => a.turno - b.turno);
  const linhasPlantao = linhasOrdenadas.filter((linha) => linha.turno >= 1 && linha.turno <= 3);

  if (linhasPlantao.length === 0) {
    return linhasOrdenadas.map((linha) => montarLinhaPdf(linha, quebrarIntervalos(linha).join(' | ')));
  }

  const intervalosPorLinha = new Map<string, string[]>();
  linhasPlantao.forEach((linha) => {
    intervalosPorLinha.set(linha.id, quebrarIntervalos(linha));
  });

  const maxIntervalos = linhasPlantao.reduce((maior, linha) => {
    const total = intervalosPorLinha.get(linha.id)?.length ?? 0;
    return Math.max(maior, total);
  }, 0);

  const linhasTabela: LinhaTabelaPdf[] = [];

  for (let ciclo = 0; ciclo < maxIntervalos; ciclo += 1) {
    linhasPlantao.forEach((linha) => {
      const horario = intervalosPorLinha.get(linha.id)?.[ciclo];
      if (!horario) return;
      linhasTabela.push(montarLinhaPdf(linha, horario));
    });
  }

  const linhasPermanencia = linhasOrdenadas.filter((linha) => linha.turno === 4);
  linhasPermanencia.forEach((linha) => {
    const horario = quebrarIntervalos(linha).join(' | ');
    linhasTabela.push(montarLinhaPdf(linha, horario));
  });

  return linhasTabela;
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

  const linhasTabela = montarLinhasTabelaPorHorario(linhas);

  autoTable(doc, {
    startY: 120,
    head: [['Horario', 'Aluno', 'Quarto', 'Cama', 'NR']],
    body:
      linhasTabela.length > 0
        ? linhasTabela
        : [['-', 'Nenhuma escala configurada para este posto', '-', '-', '-']],
    theme: 'striped',
    styles: {
      fontSize: 10,
      cellPadding: 8,
      valign: 'middle',
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 120 },
      1: { cellWidth: 230 },
      2: { cellWidth: 70 },
      3: { cellWidth: 70 },
      4: { cellWidth: 55 },
    },
  });

  doc.save(nomeArquivoSeguro(posto));
};
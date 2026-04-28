import type {
  AlocacaoFormRow,
  ConfigurarEscalaPayload,
  EscalaLinha,
  InlineDraft,
  MembroEscalaOption,
} from '../types/escala.types';
import { TOTAL_TURNOS_ESCALA } from './turno';

export const POSTOS_INICIAIS = ['Ala 5o Piso', '4o Piso', '3o Piso', 'SegFem'];

export const criarAlocacoesIniciais = (): AlocacaoFormRow[] => {
  return Array.from({ length: TOTAL_TURNOS_ESCALA }, () => criarAlocacaoVazia());
};

export const criarAlocacaoVazia = (): AlocacaoFormRow => ({
  membroGuarnicaoId: '',
  militarBusca: '',
  quarto: '',
  cama: '',
});

export const labelDoMembro = (membro: MembroEscalaOption): string => {
  return `${membro.nr} - ${membro.alunoNomeGuerra}`;
};

export const deduplicarMembrosPorNr = (
  membros: MembroEscalaOption[],
): MembroEscalaOption[] => {
  const membrosPorNr = new Map<number, MembroEscalaOption>();

  membros.forEach((membro) => {
    if (!membrosPorNr.has(membro.nr)) {
      membrosPorNr.set(membro.nr, membro);
    }
  });

  return [...membrosPorNr.values()];
};

export const filtrarMembrosPorTermo = (
  termo: string,
  membros: MembroEscalaOption[],
): MembroEscalaOption[] => {
  const busca = termo.trim().toLowerCase();
  if (!busca) return membros;

  return membros.filter((membro) => {
    return (
      String(membro.nr).includes(busca) ||
      membro.alunoNomeGuerra.toLowerCase().includes(busca) ||
      membro.alunoNomeCompleto.toLowerCase().includes(busca)
    );
  });
};

export const criarInlineDrafts = (linhas: EscalaLinha[]): Record<string, InlineDraft> => {
  return linhas.reduce<Record<string, InlineDraft>>((drafts, linha) => {
    drafts[linha.id] = {
      quarto: linha.quarto ?? '',
      cama: linha.cama ?? '',
    };
    return drafts;
  }, {});
};

export const montarPayloadConfiguracao = (
  posto: string,
  alocacoes: AlocacaoFormRow[],
  inicioPrimeiroHorario?: string,
  fimTerceiroHorario?: string,
): ConfigurarEscalaPayload => {
  return {
    posto: posto.trim(),
    inicioPrimeiroHorario: inicioPrimeiroHorario?.trim() || undefined,
    fimTerceiroHorario: fimTerceiroHorario?.trim() || undefined,
    alocacoes: alocacoes.map((alocacao, index) => ({
      membroGuarnicaoId: alocacao.membroGuarnicaoId.trim() || undefined,
      turno: index + 1,
      quarto: alocacao.quarto.trim() || null,
      cama: alocacao.cama.trim() || null,
    })),
  };
};
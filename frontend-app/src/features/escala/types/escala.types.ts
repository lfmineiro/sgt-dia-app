export type CampoEditavel = 'quarto' | 'cama';

export interface EscalaLinha {
  id: string;
  membroGuarnicaoId: string;
  posto: string;
  turno: number;
  horario: string;
  aluno: string;
  quarto: string | null;
  cama: string | null;
  nr: number;
}

export interface ConfigurarEscalaAlocacao {
  membroGuarnicaoId: string;
  turno?: number;
  quarto?: string | null;
  cama?: string | null;
}

export interface ConfigurarEscalaPayload {
  posto: string;
  alocacoes: ConfigurarEscalaAlocacao[];
}

export interface AtualizarEscalaPayload {
  quarto?: string | null;
  cama?: string | null;
}

export interface BuscarMembrosEscalaParams {
  busca?: string;
  servicoId?: string;
  limit?: number;
}

export interface MembroEscalaOption {
  id: string;
  servicoId: string;
  funcao: string;
  nr: number;
  alunoNomeGuerra: string;
  alunoNomeCompleto: string;
  label: string;
}

export interface AlocacaoFormRow {
  membroGuarnicaoId: string;
  militarBusca: string;
  quarto: string;
  cama: string;
}

export interface InlineDraft {
  quarto: string;
  cama: string;
}
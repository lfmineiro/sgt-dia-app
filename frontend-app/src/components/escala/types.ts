export type CampoEditavel = 'quarto' | 'cama';

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
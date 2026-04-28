export type SpedCompany = 1 | 2;

export interface SpedFormState {
  recebimento: string;
  passagem: string;
  armamento: string;
  punidos: string;
  visitaMedica: string;
  alunosDispensa: string;
  materialCarga: string;
  refeicoes: string;
  ronda: string;
  revistaRecolher: string;
  ocorrencias: string;
}

export interface SpedSectionField {
  id: keyof SpedFormState;
  label: string;
}

export interface SpedSectionDefinition {
  id: string;
  title: string;
  fields: SpedSectionField[];
}

export interface SpedMessage {
  type: 'success' | 'error';
  text: string;
}

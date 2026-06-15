import type { SpedFormState, SpedSectionDefinition } from '../types/sped.types';

export const SPED_QUICK_FILL_TEMPLATES: Partial<
  Record<keyof SpedFormState, (nome: string, data: string) => string>
> = {
  recebimento: (nome, data) =>
    `Às [HORA]h, o ALU ${nome.toUpperCase()} assumiu o serviço de Sargento de Dia, recebendo de [NOME_ANTERIOR], na data de ${data}, sem anormalidades.`,
  passagem: (nome, data) =>
    `Às [HORA]h, o ALU ${nome.toUpperCase()} passou o serviço de Sargento de Dia para [NOME_PROXIMO], na data de ${data}, sem anormalidades.`,
  armamento: () =>
    `Armamento cautelado conforme registro. Não há variação de material.`,
};

export const INITIAL_SPED_FORM_STATE = {
  recebimento: '',
  passagem: '',
  armamento: '',
  punidos: '',
  visitaMedica: '',
  alunosDispensa: '',
  materialCarga: '',
  refeicoes: '',
  ronda: '',
  revistaRecolher: '',
  ocorrencias: '',
};

export const SPED_SECTIONS: SpedSectionDefinition[] = [
  {
    id: 'assuncao',
    title: 'Assunção e Passagem',
    fields: [
      { id: 'recebimento', label: '1. Recebimento do serviço', hasQuickFill: true },
      { id: 'passagem', label: '13. Passagem de serviço', hasQuickFill: true },
    ],
  },
  {
    id: 'armamento',
    title: 'Armamento e Pessoal',
    fields: [
      { id: 'armamento', label: '3. Armamento', hasQuickFill: true },
      { id: 'punidos', label: '4. Punidos 1ª Cia' },
      { id: 'visitaMedica', label: '6. Visita médica fora do horário de expediente' },
      { id: 'alunosDispensa', label: '7. Alunos com dispensa' },
    ],
  },
  {
    id: 'rotina',
    title: 'Rotina e Instalações',
    fields: [
      { id: 'materialCarga', label: '5. Material carga' },
      { id: 'refeicoes', label: '8. Refeições' },
      { id: 'ronda', label: '9. Ronda' },
      { id: 'revistaRecolher', label: '10. Revista do recolher' },
      { id: 'ocorrencias', label: '12. Ocorrências' },
    ],
  },
];

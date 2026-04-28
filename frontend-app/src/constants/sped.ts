import type { SpedSectionDefinition } from '../types/sped.types';

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
      { id: 'recebimento', label: '1. Recebimento do serviço' },
      { id: 'passagem', label: '13. Passagem de serviço' },
    ],
  },
  {
    id: 'armamento',
    title: 'Armamento e Pessoal',
    fields: [
      { id: 'armamento', label: '3. Armamento' },
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

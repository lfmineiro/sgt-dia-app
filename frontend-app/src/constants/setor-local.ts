export const SetorLocal = {
  ALA_5_PISO: 'ALA_5_PISO',
  ALA_4_PISO: 'ALA_4_PISO',
  ALA_3_PISO: 'ALA_3_PISO',
  SEG_FEM: 'SEG_FEM',
} as const;

export type SetorLocal = (typeof SetorLocal)[keyof typeof SetorLocal];

export const SETOR_LOCAL_LABELS: Record<SetorLocal, string> = {
  ALA_5_PISO: 'Ala 5° Piso',
  ALA_4_PISO: '4° Piso',
  ALA_3_PISO: '3° Piso',
  SEG_FEM: 'SegFem',
};

export const POSTOS_ORDENADOS: SetorLocal[] = [
  SetorLocal.ALA_5_PISO,
  SetorLocal.ALA_4_PISO,
  SetorLocal.ALA_3_PISO,
  SetorLocal.SEG_FEM,
];

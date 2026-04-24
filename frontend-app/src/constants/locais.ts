// src/constants/locais.ts

// 1. Tipagem para ajudar o Autocomplete do VS Code
export type Setor = 'ALA_5_PISO' | 'ALA_4_PISO' | 'ALA_3_PISO' | 'SEG_FEM';

export interface Comodo {
  id: string;
  label: string;
}

export const ORDEM_SETORES: Setor[] = ['ALA_5_PISO', 'ALA_4_PISO', 'ALA_3_PISO', 'SEG_FEM'];

export const LABEL_SETOR: Record<Setor, string> = {
  ALA_5_PISO: 'Ala 5º Piso',
  ALA_4_PISO: '4º Piso',
  ALA_3_PISO: '3º Piso',
  SEG_FEM: 'SegFem',
};

export const ABAS_ALTERACOES = ORDEM_SETORES.map((setor) => LABEL_SETOR[setor]);

// 2. O Mapeamento de Fato
export const MAPEAMENTO_QUARTOS: Record<Setor, Comodo[]> = {
  ALA_5_PISO: [
    { id: 'Q_5001', label: 'Quarto 5001' },
    { id: 'Q_5002', label: 'Quarto 5002' },
    { id: 'Q_5003', label: 'Quarto 5003' },
    { id: 'Q_5004', label: 'Quarto 5004' },
    { id: 'Q_5005', label: 'Quarto 5005' },
    { id: 'Q_5006', label: 'Quarto 5006' },
    { id: 'Q_5007', label: 'Quarto 5007' },
    { id: 'Q_5008', label: 'Quarto 5008' },
    { id: 'Q_5009', label: 'Quarto 5009' },
    { id: 'Q_5010', label: 'Quarto 5010' },
    { id: 'Q_5011', label: 'Quarto 5011' },
    { id: 'Q_5012', label: 'Quarto 5012' },
    { id: 'WC_SUL_5', label: 'Banheiro Sul' },
    { id: 'WC_NORTE_5', label: 'Banheiro Norte' },
  ],
  
  ALA_4_PISO: [
    { id: 'Q_4', label: 'Quartos' },
    { id: 'WC_4', label: 'Banheiro ' },
  ],

  ALA_3_PISO: [
    { id: 'Q_3', label: 'Quartos' },
    { id: 'WC_3', label: 'Banheiro' },
  ],

  SEG_FEM: [
    { id: 'WC_SF', label: 'Banheiro' },
    { id: 'SALA_ESTAR_SF', label: 'Sala de Estar' }
  ]
};

// 3. Função Helper para traduzir o ID para o Label (Para usar na Tabela)
export function getLabelComodo(idComodo: string): string {
  for (const setor in MAPEAMENTO_QUARTOS) {
    const comodoEncontrado = MAPEAMENTO_QUARTOS[setor as Setor].find(c => c.id === idComodo);
    if (comodoEncontrado) {
      return comodoEncontrado.label;
    }
  }
  return idComodo; 
}

export function getSetorByAba(aba: string): Setor {
  const setor = ORDEM_SETORES.find((item) => LABEL_SETOR[item] === aba);
  return setor ?? ORDEM_SETORES[0];
}
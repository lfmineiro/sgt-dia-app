export interface Aviso {
  id: string;
  servicoId: string;
  titulo: string;
  descricao: string;
  criadoEm: string;
}

export interface CriarAvisoInput {
  titulo: string;
  descricao: string;
}

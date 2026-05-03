import type { Alteracao } from "./alteracao.types"


export interface ComodoCardProps {
  nomeComodo: string
  comodoId: string
  status: 'Verificado' | 'Pendente'
  alteracoes: Alteracao[] | null
  onResolverAlteracao: (id: string) => void
  onAbrirModalAdicionar: (comodoId: string, nome: string) => void
}

export interface AlteracaoItemProps {
  alteracao: Alteracao
  onResolver: (id: string) => void
}

export interface ToggleQuartosProps {
  abaAtiva: string
  alteracoes: Alteracao[] | null
  handleResolverAlteracao: (id: string) => void
  onAbrirModal: (comodoId: string, nome: string) => void
}

export interface ModalNovaAlteracaoProps {
  visible: boolean;
  onClose: () => void;
  comodoNome: string;
  onSave: (descricao: string, imagemUri: string | null) => Promise<void>;
}

export interface PhotoPickerProps {
  imagemUri: string | null;
  onChange: (uri: string | null) => void;
}
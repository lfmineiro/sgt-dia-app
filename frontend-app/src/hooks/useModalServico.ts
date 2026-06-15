import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { buscarAlunos } from "../services/alunos.service";
import { criarNovoServico, atualizarServico } from "../services/sevicos.service";
import { SARGENTO_DIA_ATUAL_QUERY_KEY } from "./useSargentoDiaAtual";
import { useServicoFormState } from "./useServicoFormState";

export const useModalServico = (onClose: () => void, initialServico?: any) => {
  const queryClient = useQueryClient()
  const isEdicao = Boolean(initialServico)

  const {
    dataServico,
    setDataServico,
    membros,
    adicionarMembro,
    removerMembro,
    atualizarMembro,
  } = useServicoFormState(initialServico)

  const {data : alunos = [] } = useQuery({
    queryKey: ['alunos_lista'],
    queryFn: buscarAlunos
  })

  const createMutation = useMutation({
    mutationFn: criarNovoServico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SARGENTO_DIA_ATUAL_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['servicosConfiguracao'] })
      onClose()
    } 
  })

  const updateMutation = useMutation({
    mutationFn: (payload: { id: string, data: any }) => atualizarServico(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SARGENTO_DIA_ATUAL_QUERY_KEY })
      queryClient.invalidateQueries({ queryKey: ['servicosConfiguracao'] })
      onClose()
    }
  })

  const handleSalvar = () => {
    const membrosValidos = membros.filter(m => m.alunoNumero !== 0 && m.funcao !== '');
    const dataCompleta = new Date(dataServico + "T12:00:00.000Z").toISOString()
    
    if (isEdicao && initialServico?.id) {
      updateMutation.mutate({
        id: initialServico.id,
        data: { data: dataCompleta, membros: membrosValidos }
      })
    } else {
      createMutation.mutate({ data: dataCompleta, membros: membrosValidos })
    }
  };

  return {
    dataServico, setDataServico,
    membros, alunos,
    adicionarMembro, removerMembro, handleSalvar, atualizarMembro,
    isSalvando: createMutation.isPending || updateMutation.isPending
  }
}
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { buscarAlunos } from "../../../services/alunos.service";
import { criarNovoServico } from "../services/servicos.service";
import { SARGENTO_DIA_ATUAL_QUERY_KEY } from "./useSargentoDiaAtual";
import { useServicoFormState } from "./useServicoFormState";

export const useModalServico = (onClose: () => void) => {
  const queryClient = useQueryClient()

  const {
    dataServico,
    setDataServico,
    membros,
    adicionarMembro,
    removerMembro,
    atualizarMembro,
  } = useServicoFormState()

  const {data : alunos = [] } = useQuery({
    queryKey: ['alunos_lista'],
    queryFn: buscarAlunos
  })

  const mutation = useMutation({
    mutationFn: criarNovoServico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SARGENTO_DIA_ATUAL_QUERY_KEY })
      onClose()
    } 
  })

  const handleSalvar = () => {
    const membrosValidos = membros.filter(m => m.alunoNumero !== 0 && m.funcao !== '');
    const dataCompleta = new Date(dataServico + "T12:00:00.000Z").toISOString()
    mutation.mutate({data: dataCompleta, membros: membrosValidos})
  };

  return {
    dataServico, setDataServico,
    membros, alunos,
    adicionarMembro, removerMembro, handleSalvar, atualizarMembro,
    isSalvando: mutation.isPending
  }
}
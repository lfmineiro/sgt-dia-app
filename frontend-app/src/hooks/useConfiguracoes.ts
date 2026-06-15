import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchAlteracoes, atualizarAlteracao, removerAlteracao } from '../services/alteracao.service'
import { fetchServicos, atualizarServico } from '../services/sevicos.service'
import type { Alteracao, AtualizarAlteracaoInput } from '../types/alterecao.types'

export const useConfiguracoes = () => {
  const queryClient = useQueryClient()

  // Alterações
  const {
    data: alteracoes = [],
    isLoading: isLoadingAlteracoes,
    isError: isErrorAlteracoes,
  } = useQuery({
    queryKey: ['alteracoesConfiguracao'],
    queryFn: () => fetchAlteracoes(),
  })

  const atualizarAlteracaoMutacao = useMutation({
    mutationFn: async (dados: { id: string; payload: AtualizarAlteracaoInput }) => {
      return await atualizarAlteracao(dados.id, dados.payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alteracoesConfiguracao'] })
    },
  })

  const removerAlteracaoMutacao = useMutation({
    mutationFn: async (id: string) => {
      return await removerAlteracao(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alteracoesConfiguracao'] })
    },
  })

  // Serviços
  const {
    data: servicos = [],
    isLoading: isLoadingServicos,
    isError: isErrorServicos,
  } = useQuery({
    queryKey: ['servicosConfiguracao'],
    queryFn: () => fetchServicos(),
  })

  const atualizarServicoMutacao = useMutation({
    mutationFn: async (dados: { id: string; status: 'EM_ANDAMENTO' | 'FECHADO' }) => {
      return await atualizarServico(dados.id, { status: dados.status })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicosConfiguracao'] })
    },
  })

  return {
    // Alterações
    alteracoes: alteracoes as Alteracao[],
    isLoadingAlteracoes,
    isErrorAlteracoes,
    atualizarAlteracao: atualizarAlteracaoMutacao.mutate,
    isUpdatingAlteracao: atualizarAlteracaoMutacao.isPending,
    removerAlteracao: removerAlteracaoMutacao.mutate,
    isRemovingAlteracao: removerAlteracaoMutacao.isPending,

    // Serviços
    servicos,
    isLoadingServicos,
    isErrorServicos,
    atualizarServico: atualizarServicoMutacao.mutate,
    isUpdatingServico: atualizarServicoMutacao.isPending,
  }
}

import { useState } from "react"
import { atualizarStatusAlteracao } from "../services/alteracao.service"
import { useQueryClient } from "@tanstack/react-query"
import type { Alteracao } from "../types/alterecao.types"

export const useToggleQuarto = (initialExpandedComodoId?: string) => {
  const queryClient = useQueryClient()
  const [quartosExpandidos, setQuartosExpandidos] = useState<string[]>(
    initialExpandedComodoId ? [initialExpandedComodoId] : [],
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [comodoSelecionado, setComodoSelecionado] = useState<string | null>(null)
  const [alteracaoSelecionada, setAlteracaoSelecionada] = useState<Alteracao | null>(null)

  const toggleQuarto = (id: string) => {
    setQuartosExpandidos((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id],
    )
  }

  const abrirModalAlteracao = (comodoId: string) => {
    setAlteracaoSelecionada(null)
    setComodoSelecionado(comodoId)
    setIsModalOpen(true)
  }

  const abrirModalEdicaoAlteracao = (alteracao: Alteracao) => {
    setAlteracaoSelecionada(alteracao)
    setComodoSelecionado(alteracao.comodo)
    setIsModalOpen(true)
  }

  const fecharModalAlteracao = () => {
    setIsModalOpen(false)
    setComodoSelecionado(null)
    setAlteracaoSelecionada(null)
  }

  const handleResolverAlteracao = async (alteracaoId: string) => {
    const alteracaoAtualizada = await atualizarStatusAlteracao(alteracaoId)

    if (!alteracaoAtualizada) return

    await queryClient.invalidateQueries({ queryKey: ["alteracoesAtuais"] })
  }

  return {
    quartosExpandidos,
    isModalOpen,
    comodoSelecionado,
    alteracaoSelecionada,
    toggleQuarto,
    abrirModalAlteracao,
    abrirModalEdicaoAlteracao,
    fecharModalAlteracao,
    handleResolverAlteracao,
  }
}

import { useEffect, useMemo, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  atualizarAlteracao,
  criarAlteracao,
  uploadFotoAlteracao,
} from "../services/alteracao.service"
import { MAPEAMENTO_QUARTOS, type Setor } from "../constants/locais"
import type { Alteracao, StatusAlteracao } from "../types/alterecao.types"

interface UseModalAlteracaoParams {
  onClose: () => void
  local: Setor
  comodo: string
  alteracao?: Alteracao | null
  onSaved?: () => void
}

export const useModalAlteracao = ({
  onClose,
  local,
  comodo,
  alteracao,
  onSaved,
}: UseModalAlteracaoParams) => {
  const queryClient = useQueryClient()
  const isEdicao = Boolean(alteracao)
  const [descricao, setDescricao] = useState(alteracao?.descricao ?? "")
  const [localSelecionado, setLocalSelecionado] = useState<Setor>(alteracao?.local ?? local)
  const [comodoSelecionado, setComodoSelecionado] = useState<string>(alteracao?.comodo ?? comodo)
  const [statusSelecionado, setStatusSelecionado] = useState<StatusAlteracao>(
    alteracao?.status ?? "NOVA",
  )
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const previewUrl = useMemo(() => {
    if(!arquivo) return null
    return URL.createObjectURL(arquivo)
  }, [arquivo])

  useEffect( () => {
    return () => {
      if(previewUrl)
      URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  // Atualiza o cômodo imediatamente quando o local é alterado,
  // evitando setState dentro de um useEffect que pode causar renders encadeados.
  const handleMudarLocal = (novoLocal: Setor) => {
    setLocalSelecionado(novoLocal)

    const novosComodos = MAPEAMENTO_QUARTOS[novoLocal] ?? []

    if (novosComodos.length > 0) {
      setComodoSelecionado(novosComodos[0].id)
    } else {
      setComodoSelecionado("")
    }
  }

  const resetForm = () => {
    setDescricao(alteracao?.descricao ?? "")
    setLocalSelecionado(alteracao?.local ?? local)
    setComodoSelecionado(alteracao?.comodo ?? comodo)
    setStatusSelecionado(alteracao?.status ?? "NOVA")
    setArquivo(null)
    setErro(null)
    setIsSubmitting(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const descricaoLimpa = descricao.trim()

    setIsSubmitting(true)

    let fotoUrl: string | null = null

    if (arquivo) {
      const upload = await uploadFotoAlteracao(arquivo)
      if (!upload) {
        setErro("Não foi possível fazer o upload da foto.")
        setIsSubmitting(false)
        return
      }

      fotoUrl = upload.fotoUrl
    }

    if (isEdicao && alteracao) {
      const alteracaoAtualizada = await atualizarAlteracao(alteracao.id, {
        descricao: descricaoLimpa,
        local: localSelecionado,
        comodo: comodoSelecionado,
        fotoUrl: fotoUrl ?? alteracao.fotoUrl,
        status: statusSelecionado,
      })

      if (!alteracaoAtualizada) {
        setErro("Não foi possível atualizar a alteração.")
        setIsSubmitting(false)
        return
      }

      await queryClient.invalidateQueries({ queryKey: ["alteracoesAtuais"] })
      onSaved?.()
      handleClose()
      return
    }

    const alteracaoCriada = await criarAlteracao({
      descricao: descricaoLimpa,
      local: localSelecionado,
      comodo: comodoSelecionado,
      fotoUrl,
    })

    if (!alteracaoCriada) {
      setErro("Não foi possível criar a alteração.")
      setIsSubmitting(false)
      return
    }

    await queryClient.invalidateQueries({ queryKey: ["alteracoesAtuais"] })
    onSaved?.()
    handleClose()
  }

  return {
    descricao,
    setDescricao,
    localSelecionado,
    setLocalSelecionado: handleMudarLocal,
    setLocalSelecionadoRaw: setLocalSelecionado,
    comodoSelecionado,
    setComodoSelecionado,
    statusSelecionado,
    setStatusSelecionado,
    isEdicao,
    arquivo,
    setArquivo,
    erro,
    isSubmitting,
    fileInputRef,
    handleSubmit,
    handleClose,
    previewUrl,
    fotoAtualUrl: alteracao?.fotoUrl ?? null,
  }
}
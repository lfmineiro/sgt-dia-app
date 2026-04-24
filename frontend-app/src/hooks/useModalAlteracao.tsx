import { useEffect, useMemo, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { criarAlteracao, uploadFotoAlteracao } from "../services/alteracao.service"
import type { Setor } from "../constants/locais"

interface UseModalAlteracaoParams {
  onClose: () => void
  local: Setor
  comodo: string
  onCreated?: () => void
}

export const useModalAlteracao = ({ onClose, local, comodo, onCreated }: UseModalAlteracaoParams) => {
  const queryClient = useQueryClient()
  const [descricao, setDescricao] = useState("")
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

  const resetForm = () => {
    setDescricao("")
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

    const alteracaoCriada = await criarAlteracao({
      descricao: descricaoLimpa,
      local,
      comodo,
      fotoUrl,
    })

    if (!alteracaoCriada) {
      setErro("Não foi possível criar a alteração.")
      setIsSubmitting(false)
      return
    }

    await queryClient.invalidateQueries({ queryKey: ["alteracoesAtuais"] })
    onCreated?.()
    handleClose()
  }

  return {
    descricao,
    setDescricao,
    arquivo,
    setArquivo,
    erro,
    isSubmitting,
    fileInputRef,
    handleSubmit,
    handleClose,
    previewUrl,
  }
}
import { useState } from 'react'

export const useAlteracaoForm = () => {
  const [descricao, setDescricao] = useState('')
  const [imagemUri, setImagemUri] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const maxLength = 500

  const handleSalvar = async (onSave: (desc: string, img: string | null) => Promise<void>) => {
    if (!descricao.trim()) return
    setIsSubmitting(true)
    try {
      await onSave(descricao, imagemUri)
      resetForm()
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setDescricao('')
    setImagemUri(null)
  }

  return {
    descricao,
    setDescricao,
    imagemUri,
    setImagemUri,
    isSubmitting,
    maxLength,
    handleSalvar,
    resetForm,
  }
}
import { useState } from 'react'

export const useAlteracaoForm = () => {
  const [descricao, setDescricao] = useState('')
  const [imagemUri, setImagemUri] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const maxLength = 500

  const handleSalvar = async (onSave: (desc: string, img: string | null) => Promise<boolean>) => {
    if (!descricao.trim()) return
    setIsSubmitting(true)
    try {
      const saved = await onSave(descricao, imagemUri)
      if (saved) {
        resetForm()
      }
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
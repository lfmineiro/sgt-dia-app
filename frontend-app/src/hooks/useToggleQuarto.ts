import { useState } from "react"

export const useToggleQuarto = (initialExpandedComodoId?: string) => {
  const [quartosExpandidos, setQuartosExpandidos] = useState<string[]>(
    initialExpandedComodoId ? [initialExpandedComodoId] : [],
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [comodoSelecionado, setComodoSelecionado] = useState<string | null>(null)

  const toggleQuarto = (id: string) => {
    setQuartosExpandidos((prev) =>
      prev.includes(id) ? prev.filter((qId) => qId !== id) : [...prev, id],
    )
  }

  const abrirModalAlteracao = (comodoId: string) => {
    setComodoSelecionado(comodoId)
    setIsModalOpen(true)
  }

  const fecharModalAlteracao = () => {
    setIsModalOpen(false)
    setComodoSelecionado(null)
  }

  return {
    quartosExpandidos,
    isModalOpen,
    comodoSelecionado,
    toggleQuarto,
    abrirModalAlteracao,
    fecharModalAlteracao,
  }
}

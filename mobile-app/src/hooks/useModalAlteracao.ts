import { useState } from "react"

export const useModalAlteracao = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [comodoSelecionado, setComodoSelecionado] = useState<string | null>(null)
  const [comodoNome, setComodoNome] = useState<string>('')

  const abrirModal = (comodoId: string, nome: string) => {
    setComodoSelecionado(comodoId)
    setComodoNome(nome)
    setIsModalOpen(true)
  }

  const fecharModal = () => {
    setIsModalOpen(false)
    setComodoSelecionado(null)
    setComodoNome('')
  }

  return { isModalOpen, comodoSelecionado, comodoNome, abrirModal, fecharModal }
}
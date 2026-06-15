import { useState, useEffect } from "react"
import type { MembroServicoForm } from "../types/servicoForm.types"

const MEMBROS_INICIAIS: MembroServicoForm[] = [
  { alunoNumero: 0, funcao: "SGT_DIA" },
  { alunoNumero: 0, funcao: "PLANTAO" },
  { alunoNumero: 0, funcao: "PLANTAO" },
]

interface InitialServico {
  data: string
  membrosGuarnicao?: MembroServicoForm[]
}

export const useServicoFormState = (initialServico?: InitialServico | null) => {
  const [dataServico, setDataServico] = useState(new Date().toISOString().split("T")[0])
  const [membros, setMembros] = useState<MembroServicoForm[]>(MEMBROS_INICIAIS)

  useEffect(() => {
    if (initialServico) {
      if (initialServico.data) {
        setDataServico(new Date(initialServico.data).toISOString().split("T")[0])
      }
      if (initialServico.membrosGuarnicao && initialServico.membrosGuarnicao.length > 0) {
        setMembros(initialServico.membrosGuarnicao.map(m => ({
          alunoNumero: m.alunoNumero,
          funcao: m.funcao
        })))
      }
    }
  }, [initialServico])

  const adicionarMembro = () => setMembros([...membros, { alunoNumero: 0, funcao: "" }])

  const removerMembro = (num: number) => setMembros(membros.filter((_, i) => i !== num))

  const atualizarMembro = (index: number, campo: "alunoNumero" | "funcao", valor: string) => {
    setMembros((prev) =>
      prev.map((membro, i) => {
        if (i !== index) return membro

        if (campo === "alunoNumero") {
          return { ...membro, alunoNumero: Number(valor) || 0 }
        }

        return { ...membro, funcao: valor }
      }),
    )
  }

  return {
    dataServico,
    setDataServico,
    membros,
    adicionarMembro,
    removerMembro,
    atualizarMembro,
  }
}

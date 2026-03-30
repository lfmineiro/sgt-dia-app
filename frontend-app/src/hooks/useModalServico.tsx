import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { buscarAlunos } from "../services/alunos.service";
import { criarNovoServico } from "../services/sevicos.service";

export const useModalServico = (onClose: () => void) => {
  const queryClient = useQueryClient()

  const [dataServico, setDataServico] = useState(new Date().toISOString().split('T')[0])

  const [membros, setMembros] = useState([
    { alunoNumero: 0, funcao: 'SGT_DIA' },
    { alunoNumero: 0, funcao: 'PLANTAO' },
    { alunoNumero: 0, funcao: 'PLANTAO' },
  ])

  const {data : alunos = [] } = useQuery({
    queryKey: ['alunos_lista'],
    queryFn: buscarAlunos
  })

  const mutation = useMutation({
    mutationFn: criarNovoServico,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicoAtual'] })
      onClose()
    } 
  })

  const adicionarMembro = () => setMembros([...membros, {alunoNumero: 0, funcao: '' }])

  const removerMembro = (num: number) => setMembros(membros.filter((_, i) => i !== num))

  const atualizarMembro = (index: number, campo: 'alunoNumero' | 'funcao', valor: string) => {
    setMembros((prev) =>
      prev.map((membro, i) => {
        if (i !== index) return membro

        if (campo === 'alunoNumero') {
          return { ...membro, alunoNumero: Number(valor) || 0 }
        }

        return { ...membro, funcao: valor }
      })
    )
  };

  const handleSalvar = () => {
    const membrosValidos = membros.filter(m => m.alunoNumero !== 0 && m.funcao !== '');
    const dataCompleta = new Date(dataServico + "T12:00:00.000Z").toISOString()
    // console.log(dataCompleta)
    console.log(membros)
    mutation.mutate({data: dataCompleta, membros: membrosValidos})
  };

  return {
    dataServico, setDataServico,
    membros, alunos,
    adicionarMembro, removerMembro, handleSalvar, atualizarMembro,
    isSalvando: mutation.isPending
  }
}
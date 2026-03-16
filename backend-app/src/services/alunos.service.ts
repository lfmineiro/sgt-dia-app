import type { Aluno, Prisma } from "@prisma/client"
import { prisma } from "../lib/prisma.js"
import type { AtualizarAlunoInput, CriarAlunoInput } from "../schemas/alunos.schemas.js"

// helpers

// conferir se o número já foi cadastrado
 const buscarAlunoPorNumero = async (numero: number) => {
  const aluno = await prisma.aluno.findUnique({
    where: {numero: numero}
  })
  return aluno
 }
 export const criarAlunoService = async (input: CriarAlunoInput): Promise<Aluno> => {
  
  const alunoExistente = await buscarAlunoPorNumero(input.numero)
  
  if(alunoExistente) {
    throw new Error("ALUNO_JA_CADASTRADO")
  }
  const novoAluno = await prisma.aluno.create({
     data: input
   })
 
   return novoAluno
  }

  export const listarAlunosService = async (): Promise<Aluno[]> => {
    const getAlunos = await prisma.aluno.findMany({
      orderBy: {
        anoFormatura: 'asc'
      }
    })
    return getAlunos
  }

  export const atualizarAlunoService = async (numeroAtual: number, data: Prisma.AlunoUpdateInput) => {
    const alunoExistente = await buscarAlunoPorNumero(numeroAtual)

    if(!alunoExistente) {
      throw new Error("ALUNO_NAO_ENCONTRADO")
    }

    // Se ele estiver tentando mudar o número
    // Ou seja, ele fornece o numero no input (body) e é um numero diferente do numeroAtual
    // Vamos conferir se não tem conflito e atualizar o aluno
    if(data.numero && data.numero != numeroAtual) {
      const conflito = await buscarAlunoPorNumero(Number(data.numero))
      if(conflito) throw new Error("NUMERO_EM_USO");
    }

    const alunoAtualizado = await prisma.aluno.update({
      where: {numero: numeroAtual},
      data: data
    })

    return alunoAtualizado
  }

  export const deletarAlunoService = async (numero: number) => {
    const alunoExistente = await buscarAlunoPorNumero(numero)

    if(!alunoExistente) throw new Error("ALUNO_NAO_ENCONTRADO");

    return await prisma.aluno.delete({
      where: {
        numero
      }
    })
  }
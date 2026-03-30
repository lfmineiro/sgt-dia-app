import type { Request, Response } from "express";
import { alunoNumeroParamSchema, atualizarAlunoSchema, criarAlunoSchema } from "../schemas/alunos.schemas.js";
import { atualizarAlunoService, criarAlunoService, deletarAlunoService, listarAlunosService } from "../services/alunos.service.js";


export const criarAluno = async (req: Request, res: Response) => {
  try {   
    const dadosValidados = criarAlunoSchema.parse(req.body)
    const novoAluno = await criarAlunoService(dadosValidados)
    return res.status(201).json(novoAluno)
  } catch (err: any) {
    if(err.message === "ALUNO_JA_CADASTRADO") return res.status(409).json({error: "Aluno já cadastrado"});
    
    console.error('Erro ao criar o aluno: ', err)
    return res.status(500).json({
      error: "Erro interno do servidor ao processar a requisição"
    })
  }
} 

export const listarAlunos = async (req: Request, res: Response) => {
  try{
    const getAlunos = await listarAlunosService();
    res.status(200).json(getAlunos);
  } catch (err) {
    console.error("Erro ao listar os Alunos")
    return res.status(500).json({
      error: "Erro interno do servidor ao processar a informação"
    })
  }
}

export const atualizarAluno = async (req: Request, res: Response) => {
  try {
    const paramResult = alunoNumeroParamSchema.parse(req.params)
  
    const numeroAtual = paramResult.numero
    const dadosValidados = atualizarAlunoSchema.parse(req.body)
    
      const alunoAtualizado = await atualizarAlunoService(numeroAtual, dadosValidados)
      
      return res.status(200).json(alunoAtualizado)
  } catch (err:any) {
    if(err.message === "ALUNO_NAO_ENCONTRADO") return res.status(404).json({
        error: "Aluno não encontrado"
      })
      if(err.message === "NUMERO_EM_USO") return res.status(409).json({
        error: "Novo número já está em uso"
      })
      console.error('Erro ao atualizar aluno: ', err)
      return res.status(500).json({
        error: 'Erro interno do servidor'
      })

    
  }
}

export const deletarAluno = async (req: Request, res: Response) => {
  try{
    const paramResult = alunoNumeroParamSchema.parse(req.params)
  
    const numero = paramResult.numero
  
    await deletarAlunoService(numero)
  
    return res.status(204).send();

  } catch (err: any) {
    if (err.message === "ALUNO_NAO_ENCONTRADO") return res.status(404).json({ error: "Aluno não encontrado" });

    const prismaErrorCode =
      err && typeof err === "object" && "code" in err ? String(err.code) : null;

    if (prismaErrorCode === "P2003") {
      return res.status(409).json({
        error: "Aluno possui vínculo com serviço/guarnição e não pode ser deletado",
      });
    }
    
    console.error('Erro ao deletar aluno: ', err);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
  }
 

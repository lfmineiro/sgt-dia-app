import { FuncaoMembroGuarnicao, StatusServico } from "@prisma/client";
import { z } from "zod";
import {numeroSchema } from "./alunos.schemas.js";

const dataServicoSchema = z.iso.datetime({
    error: "data no formato inválido: 2026-04-26"
  }).transform(value => new Date(value))

  const membrosServicoSchema = z.array(
    z.object({
      alunoNumero: numeroSchema,
      funcao: z.enum(FuncaoMembroGuarnicao)
    })
  ).min(1, "Informe ao menos um membro para o serviço")

export const CriarServicoSchema = z.object({
  data: dataServicoSchema,
  membros: membrosServicoSchema
});

export type CriarServicoBody = z.infer<typeof CriarServicoSchema>

export const ServicoAtualSgtDiaSchema = z.object({
  servicoId: z.string().uuid(),
  dataServico: z.date(),
  statusServico: z.enum(StatusServico),
  numero: z.number().int().positive(),
  nomeGuerra: z.string().min(1),
  nomeCompleto: z.string().min(1),
  anoFormatura: z.number().int(),
  curso: z.string().nullable(),
})

export type ServicoAtualSgtDiaDTO = z.infer<typeof ServicoAtualSgtDiaSchema>
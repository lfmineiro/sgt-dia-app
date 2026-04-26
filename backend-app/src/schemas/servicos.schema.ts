import { FuncaoMembroGuarnicao } from "@prisma/client";
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
  )

export const CriarServicoSchema = z.object({
  data: dataServicoSchema,
  membros: membrosServicoSchema
});

export type CriarServicoBody = z.infer<typeof CriarServicoSchema>
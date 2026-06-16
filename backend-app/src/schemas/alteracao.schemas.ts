import { z } from "zod";
import { SetorLocal, StatusAlteracao } from "@prisma/client";

export const criarAlteracaoSchema = z.object({
  local: z.enum(SetorLocal),
  descricao: z.string().min(5, "Informe uma descrição mais detalhada"),
  fotoUrl: z.string().url("URL da foto inválida").nullish().transform((value) => value ?? null),
  comodo: z.string()
});

export type CriarAlteracaoInput = z.infer<typeof criarAlteracaoSchema>;

export const alteracaoIdParamSchema = z.object({
  id: z.string().uuid("ID da alteração inválido"),
});

export const atualizarStatusAlteracaoSchema = z.object({
  status: z.enum(StatusAlteracao),
});

export type AtualizarStatusAlteracaoInput = z.infer<typeof atualizarStatusAlteracaoSchema>;

export const listarAlteracoesQuerySchema = z.object({
  status: z.enum(StatusAlteracao).optional(),
  local: z.enum(SetorLocal).optional(),
  comodo: z.string().optional(),
});

export type ListarAlteracoesQueryInput = z.infer<typeof listarAlteracoesQuerySchema>;

export const atualizarAlteracaoSchema = z
  .object({
    descricao: z.string().min(5, "Informe uma descrição mais detalhada").optional(),
    local: z.enum(SetorLocal).optional(),
    fotoUrl: z.string().url("URL da foto inválida").nullable().optional(),
    comodo: z.string().optional(),
    status: z.enum(StatusAlteracao).optional(),
  })
  .refine((dados) => Object.values(dados).some((valor) => valor !== undefined), {
    message: "Informe ao menos um campo para atualizar",
  });

export type AtualizarAlteracaoInput = z.infer<typeof atualizarAlteracaoSchema>;

export const verificarAlteracaoSchema = z.object({
  verificada: z.boolean(),
});

export type VerificarAlteracaoInput = z.infer<typeof verificarAlteracaoSchema>;




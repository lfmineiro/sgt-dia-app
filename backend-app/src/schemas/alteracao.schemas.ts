import { z } from "zod";
import { SetorLocal } from "@prisma/client";

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
  status: z.enum(["NOVA", "PENDENTE", "RESOLVIDA"]),
});

export type AtualizarStatusAlteracaoInput = z.infer<typeof atualizarStatusAlteracaoSchema>;




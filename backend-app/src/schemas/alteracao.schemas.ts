import { z } from "zod";

export const criarAlteracaoSchema = z.object({
  servicoId: z.string().uuid("Serviço inválido"),
  local: z.string().min(2, "Informe o local da alteração"),
  descricao: z.string().min(5, "Informe uma descrição mais detalhada"),
  fotoUrl: z.string().url("URL da foto inválida").nullish().transform((value) => value ?? null),
});

export type CriarAlteracaoInput = z.infer<typeof criarAlteracaoSchema>;




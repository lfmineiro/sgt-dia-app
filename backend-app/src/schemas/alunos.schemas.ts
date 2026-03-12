import z from "zod";

// Criar um schema para a criação de um aluno
export const criarAlunoSchema = z.object({
  numero: z.number()
  .int("O número deve ser um valor inteiro")
  .min(10000, "O número do aluno deve ter exatamente 5 dígitos")
  .max(99999, "O número do aluno não pode ter mais que 5 dígitos."),
  nomeGuerra: z.string().min(2, "Nome de guerra muito curto"),
  nomeCompleto: z.string().min(5, "Nome completo deve ter pelo menos 5 caracteres"),
  anoFormatura: z.number()
  .int()
  .min(24, "Ano de formatura inválido")
  .max(99, "O ano de formatura deve ter apenas 2 dígitos (ex: 27)."), // => [27, 28, 29 ,30] esse ano
  curso: z.string().nullish().transform(val => val ?? null),
});

export type CriarAlunoInput = z.infer<typeof criarAlunoSchema>;
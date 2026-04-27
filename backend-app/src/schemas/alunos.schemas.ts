import { z } from "zod";

type DefinedPartial<T> = {
  [K in keyof T]?: Exclude<T[K], undefined>;
};

const stripUndefinedFields = <T extends Record<string, unknown>>(
  data: T,
): DefinedPartial<T> => {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined),
  ) as DefinedPartial<T>;
};


export const numeroSchema = z.coerce
  .number()
  .int("O número deve ser um valor inteiro")
  .min(10000, "O número do aluno deve ter exatamente 5 dígitos")
  .max(99999, "O número do aluno não pode ter mais que 5 dígitos.");


// Criar um schema para a criação de um aluno
export const criarAlunoSchema = z.object({
  numero: numeroSchema
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
export type AtualizarAlunoInput = Partial<CriarAlunoInput>

export const atualizarAlunoSchema = criarAlunoSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "informe ao menos um campo para edição" }
  )
  .transform((data): AtualizarAlunoInput => stripUndefinedFields(data));


export const alunoNumeroParamSchema = z.object({
  numero: numeroSchema,
});

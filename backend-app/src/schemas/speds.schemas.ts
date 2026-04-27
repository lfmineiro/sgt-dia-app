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

const textoManualOpcionalSchema = z.preprocess(
  (value: unknown) => {
    if (typeof value !== "string") return value;
    const texto = value.trim();
    return texto.length === 0 ? undefined : texto;
  },
  z.string().optional(),
);

const campoOpcionalSchema = z.preprocess(
  (value: unknown) => {
    if (typeof value !== "string") return value;
    const texto = value.trim();
    return texto.length === 0 ? undefined : texto;
  },
  z.string().optional(),
);

const companhiaSchema = z.coerce
  .number()
  .int("Companhia deve ser um número inteiro")
  .refine((value: number) => value === 1 || value === 2, {
    message: "Companhia deve ser 1 ou 2",
  });

export const criarSpedSchema = z.object({
  servicoId: z.string().uuid("ID do serviço inválido"),
  companhia: companhiaSchema,
  recebimento: textoManualOpcionalSchema,
  armamento: textoManualOpcionalSchema,
  passagem: textoManualOpcionalSchema,
});

export type CriarSpedInput = z.infer<typeof criarSpedSchema>;

export const atualizarSpedSchema = z
  .object({
    recebimento: campoOpcionalSchema,
    armamento: campoOpcionalSchema,
    punidos: campoOpcionalSchema,
    materialCarga: campoOpcionalSchema,
    visitaMedica: campoOpcionalSchema,
    alunosDispensa: campoOpcionalSchema,
    refeicoes: campoOpcionalSchema,
    ronda: campoOpcionalSchema,
    revistaRecolher: campoOpcionalSchema,
    ocorrencias: campoOpcionalSchema,
    passagem: campoOpcionalSchema,
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "Informe ao menos um campo para atualização" },
  )
  .transform((data): AtualizarSpedInput => stripUndefinedFields(data));

export type AtualizarSpedInput = {
  recebimento?: string;
  armamento?: string;
  punidos?: string;
  materialCarga?: string;
  visitaMedica?: string;
  alunosDispensa?: string;
  refeicoes?: string;
  ronda?: string;
  revistaRecolher?: string;
  ocorrencias?: string;
  passagem?: string;
};

export const spedIdParamSchema = z.object({
  id: z.string().uuid("ID do SPED inválido"),
});

export type SpedIdParamInput = z.infer<typeof spedIdParamSchema>;

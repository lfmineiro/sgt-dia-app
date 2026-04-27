import { z } from "zod";

const textoManualOpcionalSchema = z.preprocess(
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

export const spedIdParamSchema = z.object({
  id: z.string().uuid("ID do SPED inválido"),
});

export type SpedIdParamInput = z.infer<typeof spedIdParamSchema>;

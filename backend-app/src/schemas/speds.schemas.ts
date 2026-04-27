import { z } from "zod";

const textoManualOpcionalSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    const texto = value.trim();
    return texto.length === 0 ? undefined : texto;
  },
  z.string().optional(),
);

export const criarSpedSchema = z.object({
  servicoId: z.string().uuid("ID do serviço inválido"),
  companhia: textoManualOpcionalSchema,
  recebimento: textoManualOpcionalSchema,
  armamento: textoManualOpcionalSchema,
  passagem: textoManualOpcionalSchema,
});

export type CriarSpedInput = z.infer<typeof criarSpedSchema>;

export const spedIdParamSchema = z.object({
  id: z.string().uuid("ID do SPED inválido"),
});

export type SpedIdParamInput = z.infer<typeof spedIdParamSchema>;

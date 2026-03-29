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

const horarioSchema = z
  .string()
  .trim()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido. Use o formato HH:mm");

const textoOpcionalSchema = z
  .string()
  .trim()
  .nullish()
  .transform((value) => {
    if (value === undefined) return undefined;
    if (value === null) return null;
    return value.length === 0 ? null : value;
  });

export const configurarEscalaSchema = z.object({
  posto: z.string().trim().min(1, "Informe o posto"),
  alocacoes: z
    .array(
      z.object({
        membroGuarnicaoId: z
          .string()
          .uuid("ID do membro da guarnição inválido"),
        horarioInicio: horarioSchema,
        horarioFim: horarioSchema,
        turno: z.coerce.number().int().positive().optional(),
        quarto: textoOpcionalSchema,
        cama: textoOpcionalSchema,
      }),
    )
    .min(1, "Informe ao menos uma alocação"),
});

export type ConfigurarEscalaInput = z.infer<typeof configurarEscalaSchema>;

export const atualizarEscalaSchema = z
  .object({
    quarto: textoOpcionalSchema,
    cama: textoOpcionalSchema,
  })
  .refine(
    (data) => data.quarto !== undefined || data.cama !== undefined,
    { message: "Informe quarto e/ou cama para atualização" },
  )
  .transform((data): AtualizarEscalaInput => stripUndefinedFields(data));

export type AtualizarEscalaInput = {
  quarto?: string | null;
  cama?: string | null;
};

export const escalaIdParamSchema = z.object({
  id: z.string().uuid("ID da escala inválido"),
});

export const postoParamSchema = z.object({
  posto: z.string().trim().min(1, "Informe o posto"),
});

export const listarMembrosEscalaQuerySchema = z.object({
  busca: z.string().trim().max(80).optional(),
  servicoId: z.string().uuid("ID do serviço inválido").optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export type ListarMembrosEscalaQuery = z.infer<
  typeof listarMembrosEscalaQuerySchema
>;
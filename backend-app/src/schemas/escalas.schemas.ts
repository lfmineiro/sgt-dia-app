import { z } from "zod";
import { SetorLocal } from "@prisma/client";

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

const textoOpcionalSchema = z
  .string()
  .trim()
  .nullish()
  .transform((value) => {
    if (value === undefined) return undefined;
    if (value === null) return null;
    return value.length === 0 ? null : value;
  });

const horarioRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const horarioOpcionalSchema = z
  .string()
  .trim()
  .nullish()
  .transform((value) => {
    if (value === undefined || value === null) return undefined;
    return value.length === 0 ? undefined : value;
  })
  .refine((value) => value === undefined || horarioRegex.test(value), {
    message: "Formato de horário inválido. Use HH:MM",
  });

const membroGuarnicaoOpcionalSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") return value;
    const valor = value.trim();
    return valor.length === 0 ? undefined : valor;
  },
  z.string().uuid("ID do membro da guarnição inválido").optional(),
);

export const configurarEscalaSchema = z.object({
  posto: z.nativeEnum(SetorLocal),
  inicioPrimeiroHorario: horarioOpcionalSchema,
  fimTerceiroHorario: horarioOpcionalSchema,
  alocacoes: z
    .array(
      z.object({
        membroGuarnicaoId: membroGuarnicaoOpcionalSchema,
        turno: z.coerce.number().int().min(1).max(4).optional(),
        quarto: textoOpcionalSchema,
        cama: textoOpcionalSchema,
      }),
    )
    .length(4, "Informe 1°, 2°, 3° Horário e Permanência"),
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
  posto: z.nativeEnum(SetorLocal),
});

export const listarEscalasPorPostoQuerySchema = z.object({
  servicoId: z.string().uuid("ID do serviço inválido").optional(),
});

export type ListarEscalasPorPostoQuery = z.infer<
  typeof listarEscalasPorPostoQuerySchema
>;

export const listarMembrosEscalaQuerySchema = z.object({
  busca: z.string().trim().max(80).optional(),
  servicoId: z.string().uuid("ID do serviço inválido").optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export type ListarMembrosEscalaQuery = z.infer<
  typeof listarMembrosEscalaQuerySchema
>;
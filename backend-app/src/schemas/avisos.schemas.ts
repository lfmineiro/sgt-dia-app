import { z } from "zod";

export const criarAvisoSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
});

export type CriarAvisoInput = z.infer<typeof criarAvisoSchema>;

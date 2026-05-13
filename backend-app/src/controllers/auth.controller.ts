import type { Request, Response } from "express";
import { ZodError } from "zod";
import { loginSchema } from "../schemas/auth.schemas.js";
import { autenticarUsuarioService } from "../services/auth.service.js";

export const realizarLogin = async (req: Request, res: Response) => {
  try {
    const dadosValidados = loginSchema.parse(req.body);
    const token = await autenticarUsuarioService(dadosValidados);

    return res.status(200).json({ token });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        error: "Dados inválidos",
        detalhes: err.issues.map((issue) => ({
          campo: issue.path.join("."),
          mensagem: issue.message,
        })),
      });
    }

    if (err instanceof Error && err.message === "CREDENCIAIS_INVALIDAS") {
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }

    if (err instanceof Error && err.message === "JWT_NAO_CONFIGURADO") {
      return res.status(500).json({ error: "Configuração JWT ausente" });
    }

    console.error("Erro ao realizar login: ", err);
    return res.status(500).json({
      error: "Erro interno do servidor ao autenticar",
    });
  }
};
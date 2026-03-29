// Middleware para tirar do controller a responsabilidade de validar o schema

import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import type { AnyZodObject } from 'zod/v3';

// É uma fábrica de middlewares. Recebe um Schema do Zod e retorna a função validadora.
export const validateSchema = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {

      await schema.parseAsync(req.body);

      return next(); 
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: "Dados inválidos",
          detalhes: error.issues.map(issue => ({
            campo: issue.path.join('.'),
            mensagem: issue.message
          }))
        });
      }
      return res.status(500).json({ error: "Erro interno na validação" });
    }
  };
};

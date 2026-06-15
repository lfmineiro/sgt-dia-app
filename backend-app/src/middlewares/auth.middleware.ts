import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

export type AuthTokenPayload = JwtPayload & {
  usuario: string;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthTokenPayload;
    }
  }
}

const obterBearerToken = (authorization?: string) => {
  if (!authorization) {
    return null;
  }

  const [tipo, token] = authorization.split(/\s+/);

  if (tipo !== "Bearer" || !token) {
    return null;
  }

  return token;
};

const obterJwtSecret = () => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_NAO_CONFIGURADO");
  }

  return secret;
};

export const autenticarToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = obterBearerToken(req.headers.authorization);

    if (!token) {
      return res.status(401).json({ error: "Token ausente ou inválido" });
    }

    const payload = jwt.verify(token, obterJwtSecret());

    if (typeof payload === "string" || typeof payload !== "object" || !("usuario" in payload)) {
      return res.status(401).json({ error: "Token inválido ou expirado" });
    }

    req.auth = payload as AuthTokenPayload;

    return next();
  } catch (err) {
    if (err instanceof Error && err.message === "JWT_NAO_CONFIGURADO") {
      return res.status(500).json({ error: "Configuração JWT ausente" });
    }

    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};

export {};
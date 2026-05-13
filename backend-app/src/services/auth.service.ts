import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { LoginInput } from "../schemas/auth.schemas.js";

const USUARIO_FIXO = process.env.AUTH_LOGIN_USER
const SENHA_FIXA = process.env.AUTH_LOGIN_PASSWORD
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1d"

const obterJwtSecret = (): Secret => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_NAO_CONFIGURADO");
  }
  return secret;
};

export const autenticarUsuarioService = async (input: LoginInput): Promise<string> => {
  const usuario = input.usuario.trim();

  if (usuario !== USUARIO_FIXO || input.senha !== SENHA_FIXA) {
    throw new Error("CREDENCIAIS_INVALIDAS");
  }

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as "1d",
    issuer: "sgt-dia-app",
    audience: "sgt-dia-app",
  };

  return jwt.sign(
    {
      sub: usuario,
      usuario,
    },
    obterJwtSecret(),
    options
  );
};
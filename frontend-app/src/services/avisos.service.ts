import { api } from "./api";
import type { Aviso, CriarAvisoInput } from "../types/aviso.types";

export const fetchAvisos = async (): Promise<Aviso[] | null> => {
  try {
    const response = await api.get("/avisos");
    if (response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar avisos: ", error);
    return null;
  }
};

export const criarAviso = async (payload: CriarAvisoInput): Promise<Aviso | null> => {
  try {
    const response = await api.post("/avisos", payload);
    if (response.data) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Erro ao criar aviso: ", error);
    return null;
  }
};

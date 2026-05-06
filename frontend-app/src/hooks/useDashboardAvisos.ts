import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { criarAviso, fetchAvisos } from "../services/avisos.service";
import type { Aviso, CriarAvisoInput } from "../types/aviso.types";

export const DASHBOARD_AVISOS_QUERY_KEY = ["dashboard", "avisos"];

interface AvisoFormState {
  titulo: string;
  descricao: string;
}

const AVISO_FORM_INICIAL: AvisoFormState = {
  titulo: "",
  descricao: "",
};

export const useDashboardAvisos = () => {
  const queryClient = useQueryClient();
  const [isAvisoModalOpen, setIsAvisoModalOpen] = useState(false);
  const [avisoForm, setAvisoForm] = useState<AvisoFormState>(AVISO_FORM_INICIAL);
  const [avisoFormError, setAvisoFormError] = useState<string | null>(null);

  const avisosQuery = useQuery<Aviso[]>({
    queryKey: DASHBOARD_AVISOS_QUERY_KEY,
    queryFn: async () => {
      const data = await fetchAvisos();
      if (data === null) {
        throw new Error("ERRO_BUSCAR_AVISOS");
      }
      return data;
    },
  });

  const criarAvisoMutation = useMutation({
    mutationFn: async (payload: CriarAvisoInput) => {
      const novoAviso = await criarAviso(payload);
      if (!novoAviso) {
        throw new Error("ERRO_CRIAR_AVISO");
      }
      return novoAviso;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: DASHBOARD_AVISOS_QUERY_KEY });
      setIsAvisoModalOpen(false);
      setAvisoForm(AVISO_FORM_INICIAL);
      setAvisoFormError(null);
    },
  });

  const openAvisoModal = () => {
    setAvisoFormError(null);
    setIsAvisoModalOpen(true);
  };

  const closeAvisoModal = () => {
    setAvisoForm(AVISO_FORM_INICIAL);
    setAvisoFormError(null);
    setIsAvisoModalOpen(false);
  };

  const handleAvisoFieldChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setAvisoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateAviso = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const titulo = avisoForm.titulo.trim();
    const descricao = avisoForm.descricao.trim();

    if (!titulo || !descricao) {
      setAvisoFormError("Título e descrição são obrigatórios");
      return;
    }

    setAvisoFormError(null);

    try {
      await criarAvisoMutation.mutateAsync({ titulo, descricao });
    } catch (error) {
      console.error("Erro ao criar aviso no dashboard: ", error);
      setAvisoFormError("Não foi possível criar o aviso");
    }
  };

  return {
    avisos: avisosQuery.data ?? [],
    isLoadingAvisos: avisosQuery.isLoading,
    isErrorAvisos: avisosQuery.isError,
    isAvisoModalOpen,
    openAvisoModal,
    closeAvisoModal,
    avisoForm,
    avisoFormError,
    handleAvisoFieldChange,
    handleCreateAviso,
    isCreatingAviso: criarAvisoMutation.isPending,
  };
};

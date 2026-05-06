import { useQuery } from "@tanstack/react-query";
import { fetchAlteracoes } from "../services/alteracao.service";
import type { Alteracao } from "../types/alterecao.types";
import { useDashboardAvisos } from "./useDashboardAvisos";
import { useDashboardMetrics } from "./useDashboardMetrics";

const DASHBOARD_ALTERACOES_QUERY_KEY = ["dashboard", "alteracoes"];

export const useDashboardData = () => {
  const alteracoesQuery = useQuery<Alteracao[]>({
    queryKey: DASHBOARD_ALTERACOES_QUERY_KEY,
    queryFn: async () => {
      const data = await fetchAlteracoes();
      if (data === null) {
        throw new Error("ERRO_BUSCAR_ALTERACOES");
      }
      return data;
    },
  });

  const dashboardAvisos = useDashboardAvisos();
  const alteracoes = alteracoesQuery.data ?? [];
  const { activities, stats } = useDashboardMetrics(alteracoes);

  const isLoading = alteracoesQuery.isLoading || dashboardAvisos.isLoadingAvisos;
  const isError = alteracoesQuery.isError || dashboardAvisos.isErrorAvisos;
  const hasAnyDashboardData = dashboardAvisos.avisos.length > 0 || alteracoes.length > 0;

  return {
    avisos: dashboardAvisos.avisos,
    activities,
    stats,
    isLoading,
    isError,
    hasAnyDashboardData,
    isAvisoModalOpen: dashboardAvisos.isAvisoModalOpen,
    openAvisoModal: dashboardAvisos.openAvisoModal,
    closeAvisoModal: dashboardAvisos.closeAvisoModal,
    avisoForm: dashboardAvisos.avisoForm,
    avisoFormError: dashboardAvisos.avisoFormError,
    handleAvisoFieldChange: dashboardAvisos.handleAvisoFieldChange,
    handleCreateAviso: dashboardAvisos.handleCreateAviso,
    isCreatingAviso: dashboardAvisos.isCreatingAviso,
  };
};

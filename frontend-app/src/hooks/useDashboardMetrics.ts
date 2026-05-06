import { useMemo } from "react";
import { LABEL_SETOR, ORDEM_SETORES } from "../constants/locais";
import type { Alteracao } from "../types/alterecao.types";

export interface DashboardActivity {
  id: string;
  title: string;
  description: string;
  variant: "success" | "warning";
}

export interface DashboardStat {
  label: string;
  value: number;
  tone?: "default" | "success" | "danger";
}

const tituloAtividadePorStatus: Record<Alteracao["status"], string> = {
  RESOLVIDA: "Alteração resolvida",
  NOVA: "Nova alteração registrada",
  PENDENTE: "Alteração pendente",
};

const tonePorSetor: Record<string, DashboardStat["tone"]> = {
  ALA_5_PISO: "success",
  ALA_4_PISO: "danger",
  ALA_3_PISO: "default",
  SEG_FEM: "default",
};

export const useDashboardMetrics = (alteracoes: Alteracao[]) => {
  const activities = useMemo<DashboardActivity[]>(() => {
    return alteracoes.slice(0, 5).map((alteracao) => ({
      id: alteracao.id,
      title: tituloAtividadePorStatus[alteracao.status],
      description: `${LABEL_SETOR[alteracao.local]} • ${alteracao.comodo}`,
      variant: alteracao.status === "RESOLVIDA" ? "success" : "warning",
    }));
  }, [alteracoes]);

  const stats = useMemo<DashboardStat[]>(() => {
    const porSetor = alteracoes.reduce<Record<string, number>>((acc, alteracao) => {
      acc[alteracao.local] = (acc[alteracao.local] ?? 0) + 1;
      return acc;
    }, {});

    const resumoSetores = ORDEM_SETORES.map((setor) => ({
      label: `Alterações ${LABEL_SETOR[setor]}`,
      value: porSetor[setor] ?? 0,
      tone: tonePorSetor[setor] ?? "default",
    }));

    return [
      {
        label: "Alterações totais",
        value: alteracoes.length,
        tone: "default",
      },
      ...resumoSetores,
    ];
  }, [alteracoes]);

  return {
    activities,
    stats,
  };
};

interface DashboardFeedbackStateProps {
  isLoading: boolean;
  isError: boolean;
  empty: boolean;
}

export const DashboardFeedbackState = ({
  isLoading,
  isError,
  empty,
}: DashboardFeedbackStateProps) => {
  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
        Carregando dados do dashboard...
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        Erro ao carregar dados do dashboard.
      </section>
    );
  }

  if (empty) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
        Nenhum dado disponível para o serviço atual.
      </section>
    );
  }

  return null;
};

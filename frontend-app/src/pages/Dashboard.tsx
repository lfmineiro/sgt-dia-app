import { DashboardAddAvisoModal } from "../components/pages/Dashboard/DashboardAddAvisoModal";
import { DashboardAvisosPanel } from "../components/pages/Dashboard/DashboardAvisosPanel";
import { DashboardFeedbackState } from "../components/pages/Dashboard/DashboardFeedbackState";
import { DashboardRecentActivities } from "../components/pages/Dashboard/DashboardRecentActivities";
import { DashboardStatsPanel } from "../components/pages/Dashboard/DashboardStatsPanel";
import { useDashboardData } from "../hooks/useDashboardData";

export const Dashboard = () => {
  const {
    avisos,
    activities,
    stats,
    isLoading,
    isError,
    hasAnyDashboardData,
    isAvisoModalOpen,
    openAvisoModal,
    closeAvisoModal,
    avisoForm,
    avisoFormError,
    handleAvisoFieldChange,
    handleCreateAviso,
    isCreatingAviso,
  } = useDashboardData();

  return (
    <div className="space-y-10">
      <DashboardFeedbackState
        isLoading={isLoading}
        isError={isError}
        empty={!isLoading && !isError && !hasAnyDashboardData}
      />

      {!isLoading && !isError && (
        <>
          <DashboardAvisosPanel avisos={avisos} onAddAviso={openAvisoModal} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            <DashboardRecentActivities activities={activities} />
            <DashboardStatsPanel stats={stats} />
          </div>
        </>
      )}

      <DashboardAddAvisoModal
        isOpen={isAvisoModalOpen}
        titulo={avisoForm.titulo}
        descricao={avisoForm.descricao}
        errorMessage={avisoFormError}
        isSubmitting={isCreatingAviso}
        onClose={closeAvisoModal}
        onChange={handleAvisoFieldChange}
        onSubmit={handleCreateAviso}
      />
    </div>
  );
};

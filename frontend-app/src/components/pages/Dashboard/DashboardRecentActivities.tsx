import { AlertTriangle, Check, Clock3 } from "lucide-react";
import type { DashboardActivity } from "../../../hooks/useDashboardMetrics";

interface DashboardRecentActivitiesProps {
  activities: DashboardActivity[];
}

export const DashboardRecentActivities = ({ activities }: DashboardRecentActivitiesProps) => {
  return (
    <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
      <h3 className="text-2xl font-bold text-slate-950 mb-8 border-b border-slate-100 pb-6">
        Atividades Recentes
      </h3>

      <div className="space-y-6">
        {activities.length === 0 ? (
          <p className="text-base text-slate-600">Nenhuma atividade recente encontrada.</p>
        ) : (
          activities.map((activity) => (
            <article
              key={activity.id}
              className="flex items-center gap-5 rounded-2xl border border-slate-100 bg-slate-50 p-5"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full shadow-inner ${
                  activity.variant === "success"
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {activity.variant === "success" ? (
                  <Check className="h-8 w-8" />
                ) : (
                  <AlertTriangle className="h-8 w-8" />
                )}
              </div>

              <div>
                <p className="text-xl font-semibold text-slate-950">{activity.title}</p>
                <p className="flex items-center gap-2 text-base text-slate-500">
                  <Clock3 className="h-4 w-4" />
                  {activity.description}
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

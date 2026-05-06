import type { DashboardStat } from "../../../hooks/useDashboardMetrics";

interface DashboardStatsPanelProps {
  stats: DashboardStat[];
}

const colorByTone: Record<string, string> = {
  default: "text-slate-950",
  success: "text-emerald-600",
  danger: "text-red-600",
};

export const DashboardStatsPanel = ({ stats }: DashboardStatsPanelProps) => {
  return (
    <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
      <h3 className="text-2xl font-bold text-slate-950 mb-8 border-b border-slate-100 pb-6">
        Estatísticas
      </h3>

      <div className="space-y-6 text-xl">
        {stats.map((stat, index) => (
          <div key={`${stat.label}-${index}`} className="flex items-center justify-between">
            <p className="font-medium text-slate-700">{stat.label}</p>
            <p className={`font-extrabold text-3xl ${colorByTone[stat.tone ?? "default"]}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

import { Calendar, Clock } from 'lucide-react';

interface SpedInfoCardProps {
  dataServicoFormatada: string;
  companhiaLabel: string;
  statusLabel: string;
}

export const SpedInfoCard = ({ dataServicoFormatada, companhiaLabel, statusLabel }: SpedInfoCardProps) => {
  return (
    <div className="flex items-start justify-between rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <Calendar className="text-blue-500" size={20} />
          <span>{dataServicoFormatada}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock size={18} />
          <span>Companhia: {companhiaLabel}</span>
        </div>
      </div>
      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">
        {statusLabel}
      </span>
    </div>
  );
};

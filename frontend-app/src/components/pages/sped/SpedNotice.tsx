import { Info } from 'lucide-react';

export const SpedNotice = () => {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4">
      <Info className="mt-0.5 shrink-0 text-blue-500" size={20} />
      <p className="text-sm text-blue-800">
        O <strong>Item 2 (Guarnição)</strong> e o <strong>Item 11 (Instalações)</strong> são gerados automaticamente pelo sistema com base nas escalas e alterações registradas.
      </p>
    </div>
  );
};

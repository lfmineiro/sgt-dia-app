interface PostoTabsProps {
  postos: string[];
  activePosto: string;
  onSelect: (posto: string) => void;
  className?: string;
}

export const PostoTabs = ({
  postos,
  activePosto,
  onSelect,
  className = '',
}: PostoTabsProps) => {
  return (
    <div className={`border-b border-slate-200 ${className}`}>
      <div className="-mb-px flex flex-wrap gap-6">
        {postos.map((posto) => {
          const isActive = posto === activePosto;

          return (
            <button
              key={posto}
              type="button"
              onClick={() => onSelect(posto)}
              className={`border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                isActive
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {posto}
            </button>
          );
        })}
      </div>
    </div>
  );
};
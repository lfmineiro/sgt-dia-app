interface TabsProps {
  options: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export function Tabs({ options, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex gap-8 border-b border-slate-200 mb-6 overflow-x-auto no-scrollbar">
      {options.map((option) => {
        const isActive = activeTab === option;
        
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={`pb-3 text-sm font-medium transition-all relative whitespace-nowrap ${
              isActive
                ? 'text-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {option}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
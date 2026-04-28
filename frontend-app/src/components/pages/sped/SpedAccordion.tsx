import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';

interface SpedAccordionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export const SpedAccordion = ({ title, isOpen, onToggle, children }: SpedAccordionProps) => {
  return (
    <div className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between bg-white px-6 py-4 transition-colors hover:bg-gray-50"
      >
        <span className="font-semibold text-gray-800">{title}</span>
        {isOpen ? (
          <ChevronUp className="text-gray-500" size={20} />
        ) : (
          <ChevronDown className="text-gray-500" size={20} />
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col gap-6 border-t border-gray-100 px-6 pb-6 pt-2">
          {children}
        </div>
      )}
    </div>
  );
};

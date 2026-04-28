import { Copy, Save, FileText } from 'lucide-react';
import { Button } from '../../ui/Button';
import type { SpedCompany } from '../../../types/sped.types';

interface SpedHeaderProps {
  companhia: SpedCompany;
  companhiaLabel: string;
  isLoading: boolean;
  isLoadingServicoAtual: boolean;
  servicoId: string;
  onCompanhiaChange: (companhia: SpedCompany) => void;
  onCopy: () => void;
  onSave?: () => void;
  onGenerate?: () => void;
}

export const SpedHeader = ({
  companhia,
  companhiaLabel,
  isLoading,
  isLoadingServicoAtual,
  servicoId,
  onCompanhiaChange,
  onCopy,
  onSave,
  onGenerate,
}: SpedHeaderProps) => {
  return (
    <header className="border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Detalhes do SPED</h1>
          <p className="text-sm text-gray-500">Preencha os campos e gere o texto do documento.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700">
            <span className="font-medium text-gray-600">Companhia</span>
            <select
              value={companhia}
              onChange={(e) => onCompanhiaChange(Number(e.target.value) as SpedCompany)}
              className="bg-transparent outline-none"
            >
              <option value={1}>1ª Cia</option>
              <option value={2}>2ª Cia</option>
            </select>
          </label>

          <Button
            type="button"
            onClick={onCopy}
            disabled={isLoading || isLoadingServicoAtual || !servicoId}
            isLoading={isLoading}
            leftIcon={<Copy className="h-5 w-5" />}
            className="min-w-44"
          >
            Copiar SPED
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={isLoading || isLoadingServicoAtual || !servicoId}
            isLoading={isLoading}
            leftIcon={<Save className="h-5 w-5" />}
            className="min-w-44"
          >
            Salvar
          </Button>
          <Button
            type="button"
            onClick={onGenerate}
            disabled={isLoading || isLoadingServicoAtual || !servicoId}
            isLoading={isLoading}
            leftIcon={<FileText className="h-5 w-5" />}
            className="min-w-44"
          >
            Gerar SPED
          </Button>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">Companhia ativa: {companhiaLabel}</p>
    </header>
  );
};

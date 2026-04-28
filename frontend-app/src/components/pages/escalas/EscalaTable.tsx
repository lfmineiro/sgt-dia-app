import type { CampoEditavel, EscalaLinha, InlineDraft } from '../../../types/escala.types';
import { gerarIntervaloPorTurno } from '../../../utils/turno';

interface EscalaTableProps {
  linhas: EscalaLinha[];
  isLoading: boolean;
  drafts: Record<string, InlineDraft>;
  onInlineChange: (id: string, campo: CampoEditavel, valor: string) => void;
  onInlineBlur: (linha: EscalaLinha, campo: CampoEditavel) => void;
}

export const EscalaTable = ({
  linhas,
  isLoading,
  drafts,
  onInlineChange,
  onInlineBlur,
}: EscalaTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="min-w-full border-collapse text-left">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-4 text-sm font-bold uppercase tracking-wide text-slate-500">Horario</th>
            <th className="px-4 py-4 text-sm font-bold uppercase tracking-wide text-slate-500">Aluno</th>
            <th className="px-4 py-4 text-sm font-bold uppercase tracking-wide text-slate-500">Quarto</th>
            <th className="px-4 py-4 text-sm font-bold uppercase tracking-wide text-slate-500">Cama</th>
            <th className="px-4 py-4 text-sm font-bold uppercase tracking-wide text-slate-500">NR</th>
          </tr>
        </thead>

        <tbody>
          {isLoading && (
            <tr>
              <td className="px-4 py-8 text-base text-slate-500" colSpan={5}>
                Carregando escalas...
              </td>
            </tr>
          )}

          {!isLoading && linhas.length === 0 && (
            <tr>
              <td className="px-4 py-8 text-base text-slate-500" colSpan={5}>
                Nenhuma escala configurada para este posto.
              </td>
            </tr>
          )}

          {linhas.map((linha, index) => {
            const draft = drafts[linha.id] ?? {
              quarto: linha.quarto ?? '',
              cama: linha.cama ?? '',
            };

            return (
              <tr key={linha.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                <td className="px-4 py-4 text-base text-slate-700">
                  {linha.horario || gerarIntervaloPorTurno(linha.turno)}
                </td>
                <td className="px-4 py-4 text-base text-slate-700">Al {linha.aluno}</td>
                <td className="px-4 py-3">
                  <input
                    value={draft.quarto}
                    onChange={(event) => onInlineChange(linha.id, 'quarto', event.target.value)}
                    onBlur={() => onInlineBlur(linha, 'quarto')}
                    className="h-10 w-24 rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    value={draft.cama}
                    onChange={(event) => onInlineChange(linha.id, 'cama', event.target.value)}
                    onBlur={() => onInlineBlur(linha, 'cama')}
                    className="h-10 w-24 rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </td>
                <td className="px-4 py-4 text-base text-slate-600">{linha.nr}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
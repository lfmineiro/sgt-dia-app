import { Plus, Search, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { AlocacaoFormRow, MembroEscalaOption } from '../types/escala.types';
import { labelDoMembro } from '../utils/escala.helpers';
import { gerarIntervaloPorTurno } from '../utils/turno';

interface ConfigurarPostoModalProps {
  isOpen: boolean;
  postos: string[];
  postoSelecionado: string;
  onPostoChange: (posto: string) => void;
  alocacoes: AlocacaoFormRow[];
  erro: string | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onAddTurno: () => void;
  onRemoveTurno: (index: number) => void;
  onAlocacaoChange: (index: number, campo: keyof AlocacaoFormRow, valor: string) => void;
  filtrarMembros: (termo: string) => MembroEscalaOption[];
}

export const ConfigurarPostoModal = ({
  isOpen,
  postos,
  postoSelecionado,
  onPostoChange,
  alocacoes,
  erro,
  isSaving,
  onClose,
  onSave,
  onAddTurno,
  onRemoveTurno,
  onAlocacaoChange,
  filtrarMembros,
}: ConfigurarPostoModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-2xl font-bold text-slate-900">Configurar Posto</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fechar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-5 px-6 py-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="posto-select">
              Posto
            </label>
            <select
              id="posto-select"
              value={postoSelecionado}
              onChange={(event) => onPostoChange(event.target.value)}
              className="h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              {postos.map((posto) => (
                <option key={posto} value={posto}>
                  {posto}
                </option>
              ))}
            </select>
          </div>

          <div className="max-h-[50vh] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 p-4">
            {alocacoes.map((linha, index) => {
              const membrosFiltrados = filtrarMembros(linha.militarBusca).slice(0, 20);

              return (
                <div
                  key={`alocacao-${index}`}
                  className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-12"
                >
                  <div className="md:col-span-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Turno {index + 1} - {gerarIntervaloPorTurno(index + 1)}
                    </p>
                    <Input
                      value={linha.militarBusca}
                      onChange={(event) => onAlocacaoChange(index, 'militarBusca', event.target.value)}
                      placeholder="Buscar militar por nome ou NR"
                      list={`membros-opcoes-${index}`}
                      iconLeft={<Search className="h-4 w-4" />}
                    />
                    <datalist id={`membros-opcoes-${index}`}>
                      {membrosFiltrados.map((membro) => (
                        <option
                          key={`${membro.id}-${index}`}
                          value={labelDoMembro(membro)}
                          label={`${labelDoMembro(membro)} (${membro.funcao})`}
                        />
                      ))}
                    </datalist>
                  </div>

                  <div className="md:col-span-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Quarto</p>
                    <Input
                      value={linha.quarto}
                      onChange={(event) => onAlocacaoChange(index, 'quarto', event.target.value)}
                      placeholder="Quarto"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Cama</p>
                    <Input
                      value={linha.cama}
                      onChange={(event) => onAlocacaoChange(index, 'cama', event.target.value)}
                      placeholder="Cama"
                    />
                  </div>

                  <div className="flex items-end justify-end md:col-span-2">
                    <button
                      type="button"
                      className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
                      onClick={() => onRemoveTurno(index)}
                      aria-label="Remover alocacao"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button type="button" variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={onAddTurno}>
              Adicionar turno
            </Button>

            {erro && <p className="text-sm font-medium text-red-600">{erro}</p>}
          </div>
        </div>

        <footer className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="button" onClick={onSave} isLoading={isSaving}>
            Salvar
          </Button>
        </footer>
      </div>
    </div>
  );
};
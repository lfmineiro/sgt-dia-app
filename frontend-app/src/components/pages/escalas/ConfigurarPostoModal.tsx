import { Search, X } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { SetorLocal } from '../../../constants/setor-local';
import { SETOR_LOCAL_LABELS } from '../../../constants/setor-local';
import type { AlocacaoFormRow, MembroEscalaOption } from '../../../types/escala.types';
import { obterDescricaoTurno } from '../../../utils/turno';
import { labelDoMembro } from '../../../utils/escala.helpers';

interface ConfigurarPostoModalProps {
  isOpen: boolean;
  postos: SetorLocal[];
  postoSelecionado: SetorLocal;
  onPostoChange: (posto: SetorLocal) => void;
  inicioPrimeiroHorario: string;
  fimTerceiroHorario: string;
  onInicioPrimeiroHorarioChange: (horario: string) => void;
  onFimTerceiroHorarioChange: (horario: string) => void;
  alocacoes: AlocacaoFormRow[];
  erro: string | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onAlocacaoChange: (index: number, campo: keyof AlocacaoFormRow, valor: string) => void;
  filtrarMembros: (termo: string) => MembroEscalaOption[];
}

export const ConfigurarPostoModal = ({
  isOpen,
  postos,
  postoSelecionado,
  onPostoChange,
  inicioPrimeiroHorario,
  fimTerceiroHorario,
  onInicioPrimeiroHorarioChange,
  onFimTerceiroHorarioChange,
  alocacoes,
  erro,
  isSaving,
  onClose,
  onSave,
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
              onChange={(event) => onPostoChange(event.target.value as SetorLocal)}
              className="h-12 w-full rounded-xl border border-slate-300 px-4 text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              {postos.map((posto) => (
                <option key={posto} value={posto}>
                  {SETOR_LOCAL_LABELS[posto]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor="inicio-primeiro-horario"
              >
                Início do 1° Horário
              </label>
              <Input
                id="inicio-primeiro-horario"
                type="time"
                value={inicioPrimeiroHorario}
                onChange={(event) => onInicioPrimeiroHorarioChange(event.target.value)}
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium text-slate-700"
                htmlFor="fim-terceiro-horario"
              >
                Fim do 3° Horário
              </label>
              <Input
                id="fim-terceiro-horario"
                type="time"
                value={fimTerceiroHorario}
                onChange={(event) => onFimTerceiroHorarioChange(event.target.value)}
              />
            </div>
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
                      {obterDescricaoTurno(index + 1, inicioPrimeiroHorario, fimTerceiroHorario)}
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

                  <div className="md:col-span-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Quarto</p>
                    <Input
                      value={linha.quarto}
                      onChange={(event) => onAlocacaoChange(index, 'quarto', event.target.value)}
                      placeholder="Quarto"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Cama</p>
                    <Input
                      value={linha.cama}
                      onChange={(event) => onAlocacaoChange(index, 'cama', event.target.value)}
                      placeholder="Cama"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end">
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
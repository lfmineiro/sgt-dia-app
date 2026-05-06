import { X } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

interface DashboardAddAvisoModalProps {
  isOpen: boolean;
  titulo: string;
  descricao: string;
  errorMessage: string | null;
  isSubmitting: boolean;
  onClose: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export const DashboardAddAvisoModal = ({
  isOpen,
  titulo,
  descricao,
  errorMessage,
  isSubmitting,
  onClose,
  onChange,
  onSubmit,
}: DashboardAddAvisoModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-slate-950">Adicionar aviso</h3>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            name="titulo"
            label="Título"
            value={titulo}
            onChange={onChange}
            placeholder="Ex: Ceia, Formatura, Inspeção"
            maxLength={120}
          />

          <div className="w-full">
            <label htmlFor="descricao-aviso" className="mb-2 block text-sm font-medium text-slate-900">
              Descrição
            </label>
            <textarea
              id="descricao-aviso"
              name="descricao"
              value={descricao}
              onChange={onChange}
              rows={5}
              maxLength={1000}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Descreva o aviso para o serviço atual"
            />
          </div>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Salvar aviso
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

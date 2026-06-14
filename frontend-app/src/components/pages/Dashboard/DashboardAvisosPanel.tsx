import { PlusCircle } from "lucide-react";
import { Button } from "../../ui/Button";
import type { Aviso } from "../../../types/aviso.types";

interface DashboardAvisosPanelProps {
  avisos: Aviso[];
  onAddAviso: () => void;
}

const formatarData = (valor: string) => {
  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return "Data inválida";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(data);
};

export const DashboardAvisosPanel = ({ avisos, onAddAviso }: DashboardAvisosPanelProps) => {
  return (
    <section className="bg-white p-8 rounded-3xl border border-slate-100 shadow-lg">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-950">Quadro de Avisos e Rotinas</h2>
        <Button
          variant="outline"
          size="md"
          leftIcon={<PlusCircle className="h-5 w-5" />}
          onClick={onAddAviso}
        >
          Adicionar Aviso
        </Button>
      </div>

      <div className="space-y-4">
        {avisos.length === 0 ? (
          <p className="text-base text-slate-600">Nenhum aviso cadastrado para o serviço atual.</p>
        ) : (
          avisos.map((aviso) => (
            <article
              key={aviso.id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-5 text-slate-800"
            >
              <header className="mb-2 flex items-center justify-between gap-4">
                <p className="text-xl font-semibold text-slate-900">{aviso.titulo}</p>
                <span className="text-sm text-slate-500">{formatarData(aviso.criadoEm)}</span>
              </header>
              <p className="text-base text-slate-700">{aviso.descricao}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

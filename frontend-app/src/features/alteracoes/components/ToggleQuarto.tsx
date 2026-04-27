import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import type { Comodo, Setor } from "../constants/locais";
import type { Alteracao } from "../types/alteracao.types";
import { useToggleQuarto } from "../hooks/useToggleQuarto";
import { ModalAddAlteracao } from "./ModalAddAlteracao";

interface ToggleQuartoProps {
  comodos: Comodo[];
  alteracoes: Alteracao[];
  setor: Setor;
  onCreated?: () => void;
}

export const ToggleQuarto = ({ comodos, alteracoes, setor, onCreated }: ToggleQuartoProps) => {
  const {
    quartosExpandidos,
    isModalOpen,
    comodoSelecionado,
    toggleQuarto,
    abrirModalAlteracao,
    fecharModalAlteracao,
  } = useToggleQuarto(comodos[0]?.id)

  return (
    <>
      {comodos.map((comodo) => {
        const isExpandido = quartosExpandidos.includes(comodo.id);
        const alteracoesComodo = alteracoes.filter((item) => item.comodo === comodo.id);
        const status = alteracoesComodo.length > 0 ? "Pendente" : "Verificado";

        return (
          <div
            key={comodo.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
          >
            {/* Linha Visível (Header do Accordion) */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => toggleQuarto(comodo.id)}
            >
              <div className="flex items-center gap-4">
                <span className="text-slate-400">
                  {isExpandido ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </span>
                <span className="font-semibold text-slate-800">{comodo.label}</span>

                {/* da pra transformar em component em /alteracao */}
                {/* lógica vai ser quando se criar um serviço por padrão as alterações não terão sidos verificadas e ao verificar todas as alterações de um quarto ou qlqr recinto o status muda */}
                {/* Salvar em algum cantos os diferentes recintos de cada alojamento */}
                <span
                  className={`px-2.5 py-1 text-xs font-medium rounded-md ${
                    status === "Verificado"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {status}
                </span>
              </div>

              {/* Botão de Adicionar Alteração */}
              <button
                // O e.stopPropagation evita que o clique no botão abra/feche o toggle
                onClick={(e) => {
                  e.stopPropagation();
                  abrirModalAlteracao(comodo.id)
                }}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-500 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                <Plus size={16} /> Adicionar Alteração
              </button>
            </div>

            {/* Ao abrir o toggle (Detalhes da Alteração) */}
            {isExpandido && (
              <div className="p-5 border-t border-slate-100 flex flex-col gap-4 bg-slate-50/50">
                {alteracoesComodo.length === 0 && (
                  <p className="text-sm text-slate-600">Nenhuma alteração neste cômodo.</p>
                )}

                {alteracoesComodo.map((alteracao) => (
                  <div key={alteracao.id} className="flex gap-6">
                    <div className="w-40 h-40 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm font-medium shrink-0 overflow-hidden">
                      {alteracao.fotoUrl ? (
                        <img
                          src={alteracao.fotoUrl}
                          alt="Foto da alteração"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        "80 x 80"
                      )}
                    </div>

                    {/* Dados da Alteração */}
                    <div className="flex flex-col gap-3">
                      <p className="text-slate-700 font-medium">{alteracao.descricao}</p>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600">Alteração Verificada</span>
                      </label>

                      <div>
                        <button className="mt-2 px-4 py-1.5 border-2 border-emerald-500 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-50 transition-colors">
                          Alteração Resolvida
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
      <ModalAddAlteracao 
       isOpen={isModalOpen}
       onClose={fecharModalAlteracao}
       local={setor}
       comodo={comodoSelecionado ?? ""}
       onCreated={onCreated}
      />
    </>
  );
};

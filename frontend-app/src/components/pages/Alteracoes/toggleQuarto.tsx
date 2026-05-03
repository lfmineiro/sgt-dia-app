import {  ChevronDown, ChevronRight, Plus } from "lucide-react";
import type { Comodo, Setor } from "../../../constants/locais";
import type { Alteracao } from "../../../types/alterecao.types";
import { useToggleQuarto } from "../../../hooks/useToggleQuarto";
import { ModalAddAlteracao } from "./ModalAddAlteracao";
import { DetalhesAlteracao } from "./DetalhesAlteracao";

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
    alteracaoSelecionada,
    toggleQuarto,
    abrirModalAlteracao,
    abrirModalEdicaoAlteracao,
    fecharModalAlteracao,
    handleResolverAlteracao,
  } = useToggleQuarto(comodos[0]?.id)

  return (
    <>
      {comodos.map((comodo) => {
        const isExpandido = quartosExpandidos.includes(comodo.id);
        const alteracoesComodo = alteracoes.filter((item) => item.comodo === comodo.id && item.status !== "RESOLVIDA");
        const status = alteracoesComodo.some((item) => item.status !== "RESOLVIDA")
          ? "Pendente"
          : "Verificado";

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

              <button
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
                  <DetalhesAlteracao 
                    alteracao={alteracao} 
                    abrirModalEdicaoAlteracao={abrirModalEdicaoAlteracao}
                    handleResolverAlteracao={handleResolverAlteracao}
                  />
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
       alteracao={alteracaoSelecionada}
       onSaved={onCreated}
      />
    </>
  );
};

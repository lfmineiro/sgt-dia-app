import { PencilLine } from "lucide-react"
import type { Alteracao } from "../../../types/alterecao.types"

type DetalhesAlteracaoProps = {
  alteracao: Alteracao
  abrirModalEdicaoAlteracao: (alteracao: Alteracao) => void
  handleResolverAlteracao: (id: string) => Promise<void>
  handleToggleVerificada: (id: string, verificada: boolean) => Promise<void>
}

export const DetalhesAlteracao = ({
  alteracao,
  abrirModalEdicaoAlteracao,
  handleResolverAlteracao,
  handleToggleVerificada,
}: DetalhesAlteracaoProps) => {
  return (
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

        <div className="flex flex-col gap-3">
          <button
            className="px-4 py-1.5 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              abrirModalEdicaoAlteracao(alteracao)
            }}
          >
            <span className="inline-flex items-center gap-2">
              <PencilLine size={16} /> Editar
            </span>
          </button>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={alteracao.verificada}
                onChange={(e) => {
                  e.stopPropagation();
                  void handleToggleVerificada(alteracao.id, e.target.checked)
                }}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-slate-600">Alteração Verificada</span>
            </label>

            <div>
              <button
                className="mt-2 px-4 py-1.5 border-2 border-emerald-500 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-50 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  void handleResolverAlteracao(alteracao.id)
                }}
              >
                Alteração Resolvida
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

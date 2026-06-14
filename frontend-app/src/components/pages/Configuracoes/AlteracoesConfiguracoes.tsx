import { useState } from 'react'
import { useConfiguracoes } from '../../../hooks/useConfiguracoes'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { ModalAddAlteracao } from '../Alteracoes/ModalAddAlteracao'
import type { Alteracao } from '../../../types/alterecao.types'
import { Trash2 } from 'lucide-react'

export const AlteracoesConfiguracoes = () => {
  const {
    alteracoes,
    isLoadingAlteracoes,
    isErrorAlteracoes,
    removerAlteracao,
  } = useConfiguracoes()

  const [alteracaoSelecionada, setAlteracaoSelecionada] = useState<Alteracao | null>(null)
  const [filtro, setFiltro] = useState('')

  const handleExcluir = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta alteração? Esta ação não pode ser desfeita.')) {
      removerAlteracao(id)
    }
  }

  const alteracoesFiltradas = alteracoes.filter((alt) =>
    alt.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
    alt.local.toLowerCase().includes(filtro.toLowerCase()) ||
    alt.comodo.toLowerCase().includes(filtro.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Filtro */}
      <Input
        placeholder="Filtrar por descrição, local ou cômodo..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {/* Status */}
      {isLoadingAlteracoes && <p className="text-slate-600">Carregando alterações...</p>}
      {isErrorAlteracoes && <p className="text-red-600">Erro ao carregar alterações</p>}

      {/* Tabela */}
      {!isLoadingAlteracoes && !isErrorAlteracoes && (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-900">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900">
                  Local
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900">
                  Cômodo
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left font-semibold text-slate-900">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {alteracoesFiltradas.map((alteracao) => (
                <tr key={alteracao.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-900">
                    <p className="line-clamp-2">{alteracao.descricao}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-900">{alteracao.local}</td>
                  <td className="px-6 py-4 text-slate-900">{alteracao.comodo}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        alteracao.status === 'NOVA'
                          ? 'bg-blue-100 text-blue-800'
                          : alteracao.status === 'PENDENTE'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {alteracao.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setAlteracaoSelecionada(alteracao)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleExcluir(alteracao.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {alteracoesFiltradas.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-600">
              {alteracoes.length === 0 ? 'Nenhuma alteração encontrada' : 'Nenhuma alteração corresponde ao filtro'}
            </div>
          )}
        </div>
      )}

      {/* Modal de Edição */}
      {alteracaoSelecionada && (
        <ModalAddAlteracao
          isOpen={true}
          onClose={() => setAlteracaoSelecionada(null)}
          local={alteracaoSelecionada.local}
          comodo={alteracaoSelecionada.comodo}
          alteracao={alteracaoSelecionada}
          onSaved={() => setAlteracaoSelecionada(null)}
        />
      )}
    </div>
  )
}

import { useState } from 'react'
import { useConfiguracoes } from '../../../hooks/useConfiguracoes'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'
import { ModalServico } from '../Dashboard/ModalServico'

interface Servico {
  id: string
  data: string
  status: 'EM_ANDAMENTO' | 'FECHADO'
  membros?: { alunoNumero: number; funcao: string }[]
}

export const ServicosConfiguracoes = () => {
  const {
    servicos,
    isLoadingServicos,
    isErrorServicos,
  } = useConfiguracoes()

  const [servicoSelecionado, setServicoSelecionado] = useState<Servico | null>(null)
  const [filtro, setFiltro] = useState('')

  const servicosFiltrados = (servicos as Servico[]).filter((srv) => {
    const data = new Date(srv.data).toLocaleDateString('pt-BR')
    return data.includes(filtro) || srv.status.toLowerCase().includes(filtro.toLowerCase())
  })

  return (
    <div className="space-y-4">
      {/* Filtro */}
      <Input
        placeholder="Filtrar por data ou status..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      {/* Status */}
      {isLoadingServicos && <p className="text-slate-600">Carregando serviços...</p>}
      {isErrorServicos && <p className="text-red-600">Erro ao carregar serviços</p>}

      {/* Tabela */}
      {!isLoadingServicos && !isErrorServicos && (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-900">
                  Data
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
              {servicosFiltrados.map((servico) => (
                <tr key={servico.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-900">
                    {new Date(servico.data).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        servico.status === 'EM_ANDAMENTO'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {servico.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Fechado'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setServicoSelecionado(servico)}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {servicosFiltrados.length === 0 && (
            <div className="px-6 py-8 text-center text-slate-600">
              {servicos.length === 0 ? 'Nenhum serviço encontrado' : 'Nenhum serviço corresponde ao filtro'}
            </div>
          )}
        </div>
      )}

      {/* Modal de Edição */}
      <ModalServico
        key={servicoSelecionado?.id ?? 'novo-servico'}
        isOpen={!!servicoSelecionado}
        onClose={() => setServicoSelecionado(null)}
        servico={servicoSelecionado}
      />
    </div>
  )
}

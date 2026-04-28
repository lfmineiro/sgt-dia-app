import { FileDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import {
  ConfigurarPostoModal,
  EscalaHeader,
  EscalaTable,
  PostoTabs
} from '../components/pages/escalas/index';
import { useEscalaViewModel } from '../hooks/useEscalaViewModel';

export const EscalaPage = () => {
  const viewModel = useEscalaViewModel();

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <EscalaHeader dataExtenso={viewModel.dataExtenso} />

        <div className="space-y-4 p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <PostoTabs
              postos={viewModel.postos}
              activePosto={viewModel.postoAtivo}
              onSelect={viewModel.setPostoAtivo}
              className="flex-1"
            />

            <Button
              type="button"
              onClick={viewModel.abrirModalConfiguracao}
              className="min-w-40"
            >
              Configurar Posto
            </Button>
          </div>

          <EscalaTable
            linhas={viewModel.linhasEscala}
            isLoading={viewModel.isCarregandoEscalas}
            drafts={viewModel.inlineDrafts}
            onInlineChange={viewModel.atualizarInline}
            onInlineBlur={viewModel.salvarInlineNoBlur}
          />

          <div className="flex justify-center pt-2">
            <Button
              type="button"
              className="min-w-56"
              leftIcon={<FileDown className="h-4 w-4" />}
              onClick={viewModel.gerarPdfAtual}
              disabled={viewModel.isCarregandoEscalas || viewModel.linhasEscala.length === 0}
            >
              Gerar PDF da Escala
            </Button>
          </div>
        </div>
      </section>

      <ConfigurarPostoModal
        isOpen={viewModel.modalAberto}
        postos={viewModel.postos}
        postoSelecionado={viewModel.postoModal}
        onPostoChange={viewModel.setPostoModal}
        inicioPrimeiroHorario={viewModel.inicioPrimeiroHorario}
        fimTerceiroHorario={viewModel.fimTerceiroHorario}
        onInicioPrimeiroHorarioChange={viewModel.setInicioPrimeiroHorario}
        onFimTerceiroHorarioChange={viewModel.setFimTerceiroHorario}
        alocacoes={viewModel.alocacoes}
        erro={viewModel.erroModal}
        isSaving={viewModel.isSalvandoConfiguracao}
        onClose={viewModel.fecharModalConfiguracao}
        onSave={viewModel.salvarConfiguracao}
        onAlocacaoChange={viewModel.atualizarAlocacao}
        filtrarMembros={viewModel.filtrarMembros}
      />
    </div>
  );
};
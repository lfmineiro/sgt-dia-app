import { useEffect, useMemo, useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PostoTabs } from '../components/PostoTabs';
import {
  atualizarEscalaService,
  buscarMembrosEscalaService,
  configurarPostoEscalaService,
  listarEscalasPorPostoService,
  type ConfigurarEscalaPayload,
  type EscalaLinha,
  type MembroEscalaOption,
} from '../services/escalas.service';

const POSTOS_INICIAIS = ['Ala 5o Piso', '4o Piso', '3o Piso', 'SegFem'];

type CampoEditavel = 'quarto' | 'cama';

interface AlocacaoFormRow {
  membroGuarnicaoId: string;
  militarBusca: string;
  horarioInicio: string;
  horarioFim: string;
  quarto: string;
  cama: string;
}

interface InlineDraft {
  quarto: string;
  cama: string;
}

const ALOCACOES_INICIAIS: AlocacaoFormRow[] = [
  {
    membroGuarnicaoId: '',
    militarBusca: '',
    horarioInicio: '08:00',
    horarioFim: '12:00',
    quarto: '',
    cama: '',
  },
  {
    membroGuarnicaoId: '',
    militarBusca: '',
    horarioInicio: '12:00',
    horarioFim: '16:00',
    quarto: '',
    cama: '',
  },
  {
    membroGuarnicaoId: '',
    militarBusca: '',
    horarioInicio: '16:00',
    horarioFim: '20:00',
    quarto: '',
    cama: '',
  },
];

const criarAlocacaoVazia = (): AlocacaoFormRow => ({
  membroGuarnicaoId: '',
  militarBusca: '',
  horarioInicio: '',
  horarioFim: '',
  quarto: '',
  cama: '',
});

const labelDoMembro = (membro: MembroEscalaOption): string => {
  return `${membro.nr} - ${membro.alunoNomeGuerra}`;
};

export const EscalaPage = () => {
  const queryClient = useQueryClient();
  const [postoAtivo, setPostoAtivo] = useState<string>(POSTOS_INICIAIS[0]);
  const [modalAberto, setModalAberto] = useState(false);
  const [postoModal, setPostoModal] = useState<string>(POSTOS_INICIAIS[0]);
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [alocacoes, setAlocacoes] = useState<AlocacaoFormRow[]>(ALOCACOES_INICIAIS);
  const [inlineDrafts, setInlineDrafts] = useState<Record<string, InlineDraft>>({});

  const dataExtenso = useMemo(() => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

  const postos = useMemo(() => {
    const lista = new Set<string>(POSTOS_INICIAIS);
    const escalasCache = queryClient.getQueryData<EscalaLinha[]>(['escalas', postoAtivo]);
    (escalasCache ?? []).forEach((linha) => lista.add(linha.posto));
    return [...lista];
  }, [postoAtivo, queryClient]);

  const escalasQuery = useQuery({
    queryKey: ['escalas', postoAtivo],
    queryFn: () => listarEscalasPorPostoService(postoAtivo),
  });

  const membrosQuery = useQuery({
    queryKey: ['escalas-membros'],
    queryFn: () => buscarMembrosEscalaService({ limit: 50 }),
    enabled: modalAberto,
  });

  const membrosPorLabel = useMemo(() => {
    const map = new Map<string, MembroEscalaOption>();
    (membrosQuery.data ?? []).forEach((membro) => {
      map.set(labelDoMembro(membro), membro);
    });
    return map;
  }, [membrosQuery.data]);

  useEffect(() => {
    const linhas = escalasQuery.data ?? [];
    const proxDrafts: Record<string, InlineDraft> = {};

    linhas.forEach((linha) => {
      proxDrafts[linha.id] = {
        quarto: linha.quarto ?? '',
        cama: linha.cama ?? '',
      };
    });

    setInlineDrafts(proxDrafts);
  }, [escalasQuery.data]);

  const configurarEscalaMutation = useMutation({
    mutationFn: (payload: ConfigurarEscalaPayload) => configurarPostoEscalaService(payload),
    onSuccess: async (_data, payload) => {
      setModalAberto(false);
      setErroModal(null);
      setPostoAtivo(payload.posto);
      await queryClient.invalidateQueries({ queryKey: ['escalas'] });
    },
  });

  const atualizarEscalaMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { quarto?: string | null; cama?: string | null } }) =>
      atualizarEscalaService(id, payload),
    onSuccess: (linhaAtualizada) => {
      queryClient.setQueryData<EscalaLinha[]>(['escalas', postoAtivo], (atual) => {
        if (!atual) return atual;
        return atual.map((linha) => (linha.id === linhaAtualizada.id ? linhaAtualizada : linha));
      });
    },
  });

  const abrirModalConfiguracao = () => {
    setPostoModal(postoAtivo);
    setErroModal(null);
    setAlocacoes(ALOCACOES_INICIAIS);
    setModalAberto(true);
  };

  const filtrarMembros = (termo: string): MembroEscalaOption[] => {
    const busca = termo.trim().toLowerCase();
    const membros = membrosQuery.data ?? [];
    if (!busca) return membros;

    return membros.filter((membro) => {
      return (
        String(membro.nr).includes(busca) ||
        membro.alunoNomeGuerra.toLowerCase().includes(busca) ||
        membro.alunoNomeCompleto.toLowerCase().includes(busca)
      );
    });
  };

  const atualizarAlocacao = (
    index: number,
    campo: keyof AlocacaoFormRow,
    valor: string,
  ) => {
    setAlocacoes((atual) => {
      return atual.map((linha, idx) => {
        if (idx !== index) return linha;

        const proximaLinha = {
          ...linha,
          [campo]: valor,
        };

        if (campo === 'militarBusca') {
          const membroSelecionado = membrosPorLabel.get(valor);
          proximaLinha.membroGuarnicaoId = membroSelecionado?.id ?? '';
        }

        return proximaLinha;
      });
    });
  };

  const adicionarAlocacao = () => {
    setAlocacoes((atual) => [...atual, criarAlocacaoVazia()]);
  };

  const removerAlocacao = (index: number) => {
    setAlocacoes((atual) => atual.filter((_item, idx) => idx !== index));
  };

  const salvarConfiguracao = () => {
    if (!postoModal.trim()) {
      setErroModal('Selecione um posto antes de salvar.');
      return;
    }

    if (alocacoes.length === 0) {
      setErroModal('Adicione pelo menos uma alocacao.');
      return;
    }

    for (let i = 0; i < alocacoes.length; i += 1) {
      const alocacao = alocacoes[i];

      if (!alocacao.membroGuarnicaoId) {
        setErroModal(`Selecione um militar valido na linha ${i + 1}.`);
        return;
      }

      if (!alocacao.horarioInicio || !alocacao.horarioFim) {
        setErroModal(`Informe horario de inicio e fim na linha ${i + 1}.`);
        return;
      }
    }

    const payload: ConfigurarEscalaPayload = {
      posto: postoModal,
      alocacoes: alocacoes.map((alocacao, index) => ({
        membroGuarnicaoId: alocacao.membroGuarnicaoId,
        turno: index + 1,
        horarioInicio: alocacao.horarioInicio,
        horarioFim: alocacao.horarioFim,
        quarto: alocacao.quarto.trim() || null,
        cama: alocacao.cama.trim() || null,
      })),
    };

    configurarEscalaMutation.mutate(payload, {
      onError: () => {
        setErroModal('Nao foi possivel salvar a configuracao. Verifique os dados e tente novamente.');
      },
    });
  };

  const atualizarInline = (id: string, campo: CampoEditavel, valor: string) => {
    setInlineDrafts((atual) => {
      const existente = atual[id] ?? { quarto: '', cama: '' };
      return {
        ...atual,
        [id]: {
          ...existente,
          [campo]: valor,
        },
      };
    });
  };

  const salvarInlineNoBlur = (linha: EscalaLinha, campo: CampoEditavel) => {
    const draft = inlineDrafts[linha.id];
    if (!draft) return;

    const valorOriginal = (linha[campo] ?? '').trim();
    const valorDraft = draft[campo].trim();

    if (valorOriginal === valorDraft) return;

    const payload: { quarto?: string | null; cama?: string | null } = {};
    payload[campo] = valorDraft.length > 0 ? valorDraft : null;

    atualizarEscalaMutation.mutate({ id: linha.id, payload });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-100 px-8 py-6">
          <h2 className="text-4xl font-bold text-slate-900">Gestao de Escala</h2>
          <p className="mt-1 text-lg capitalize text-slate-500">{dataExtenso}</p>
        </header>

        <div className="space-y-4 p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <PostoTabs
              postos={postos}
              activePosto={postoAtivo}
              onSelect={setPostoAtivo}
              className="flex-1"
            />

            <Button
              type="button"
              onClick={abrirModalConfiguracao}
              className="min-w-40"
            >
              Configurar Posto
            </Button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-4 text-sm font-bold uppercase tracking-wide text-slate-500">Horario</th>
                  <th className="px-4 py-4 text-sm font-bold uppercase tracking-wide text-slate-500">Aluno</th>
                  <th className="px-4 py-4 text-sm font-bold uppercase tracking-wide text-slate-500">Quarto</th>
                  <th className="px-4 py-4 text-sm font-bold uppercase tracking-wide text-slate-500">Cama</th>
                  <th className="px-4 py-4 text-sm font-bold uppercase tracking-wide text-slate-500">NR</th>
                </tr>
              </thead>

              <tbody>
                {escalasQuery.isLoading && (
                  <tr>
                    <td className="px-4 py-8 text-base text-slate-500" colSpan={5}>
                      Carregando escalas...
                    </td>
                  </tr>
                )}

                {!escalasQuery.isLoading && (escalasQuery.data ?? []).length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-base text-slate-500" colSpan={5}>
                      Nenhuma escala configurada para este posto.
                    </td>
                  </tr>
                )}

                {(escalasQuery.data ?? []).map((linha, index) => {
                  const draft = inlineDrafts[linha.id] ?? {
                    quarto: linha.quarto ?? '',
                    cama: linha.cama ?? '',
                  };

                  return (
                    <tr key={linha.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="px-4 py-4 text-base text-slate-700">{linha.horarioInicio} - {linha.horarioFim}</td>
                      <td className="px-4 py-4 text-base text-slate-700">Al {linha.aluno}</td>
                      <td className="px-4 py-3">
                        <input
                          value={draft.quarto}
                          onChange={(event) => atualizarInline(linha.id, 'quarto', event.target.value)}
                          onBlur={() => salvarInlineNoBlur(linha, 'quarto')}
                          className="h-10 w-24 rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          value={draft.cama}
                          onChange={(event) => atualizarInline(linha.id, 'cama', event.target.value)}
                          onBlur={() => salvarInlineNoBlur(linha, 'cama')}
                          className="h-10 w-24 rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-4 py-4 text-base text-slate-600">{linha.nr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-5xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <header className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="text-2xl font-bold text-slate-900">Configurar Posto</h3>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
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
                  value={postoModal}
                  onChange={(event) => setPostoModal(event.target.value)}
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
                        <Input
                          value={linha.militarBusca}
                          onChange={(event) => atualizarAlocacao(index, 'militarBusca', event.target.value)}
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

                      <div className="md:col-span-2">
                        <Input
                          type="time"
                          value={linha.horarioInicio}
                          onChange={(event) => atualizarAlocacao(index, 'horarioInicio', event.target.value)}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Input
                          type="time"
                          value={linha.horarioFim}
                          onChange={(event) => atualizarAlocacao(index, 'horarioFim', event.target.value)}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Input
                          value={linha.quarto}
                          onChange={(event) => atualizarAlocacao(index, 'quarto', event.target.value)}
                          placeholder="Quarto"
                        />
                      </div>

                      <div className="flex items-center gap-2 md:col-span-2">
                        <Input
                          value={linha.cama}
                          onChange={(event) => atualizarAlocacao(index, 'cama', event.target.value)}
                          placeholder="Cama"
                        />
                        <button
                          type="button"
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
                          onClick={() => removerAlocacao(index)}
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
                <Button type="button" variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={adicionarAlocacao}>
                  Adicionar turno
                </Button>

                {erroModal && <p className="text-sm font-medium text-red-600">{erroModal}</p>}
              </div>
            </div>

            <footer className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <Button type="button" variant="ghost" onClick={() => setModalAberto(false)}>
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={salvarConfiguracao}
                isLoading={configurarEscalaMutation.isPending}
              >
                Salvar
              </Button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};
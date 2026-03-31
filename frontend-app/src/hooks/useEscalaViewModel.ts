import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  atualizarEscalaService,
  buscarMembrosEscalaService,
  configurarPostoEscalaService,
  listarEscalasPorPostoService,
  type EscalaLinha,
  type MembroEscalaOption,
} from '../services/escalas.service';
import type { AlocacaoFormRow, CampoEditavel, InlineDraft } from '../components/escala/types';
import {
  criarAlocacaoVazia,
  criarAlocacoesIniciais,
  filtrarMembrosPorBusca,
  gerarDraftsInlineIniciais,
  labelDoMembroEscala,
  MEMBROS_ESCALA_LIMIT,
  montarPayloadConfiguracaoEscala,
  POSTOS_INICIAIS,
} from './escala.helpers';

export const useEscalaViewModel = () => {
  const queryClient = useQueryClient();
  const [postoAtivo, setPostoAtivo] = useState<string>(POSTOS_INICIAIS[0]);
  const [modalAberto, setModalAberto] = useState(false);
  const [postoModal, setPostoModal] = useState<string>(POSTOS_INICIAIS[0]);
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [alocacoes, setAlocacoes] = useState<AlocacaoFormRow[]>(criarAlocacoesIniciais);
  const [inlineDrafts, setInlineDrafts] = useState<Record<string, InlineDraft>>({});

  const dataExtenso = useMemo(() => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }, []);

  const escalasQuery = useQuery({
    queryKey: ['escalas', postoAtivo],
    queryFn: () => listarEscalasPorPostoService(postoAtivo),
  });

  const membrosQuery = useQuery({
    queryKey: ['escalas-membros'],
    queryFn: () => buscarMembrosEscalaService({ limit: MEMBROS_ESCALA_LIMIT }),
    enabled: modalAberto,
  });

  const postos = useMemo(() => {
    const lista = new Set<string>(POSTOS_INICIAIS);
    (escalasQuery.data ?? []).forEach((linha) => lista.add(linha.posto));
    lista.add(postoModal);
    return [...lista];
  }, [escalasQuery.data, postoModal]);

  const membrosPorLabel = useMemo(() => {
    const map = new Map<string, MembroEscalaOption>();
    (membrosQuery.data ?? []).forEach((membro) => {
      map.set(labelDoMembroEscala(membro), membro);
    });
    return map;
  }, [membrosQuery.data]);

  const filtrarMembros = (termo: string): MembroEscalaOption[] => {
    return filtrarMembrosPorBusca(membrosQuery.data ?? [], termo);
  };

  useEffect(() => {
    const linhas = escalasQuery.data ?? [];
    setInlineDrafts(gerarDraftsInlineIniciais(linhas));
  }, [escalasQuery.data]);

  const configurarEscalaMutation = useMutation({
    mutationFn: configurarPostoEscalaService,
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
    setAlocacoes(criarAlocacoesIniciais());
    setModalAberto(true);
  };

  const fecharModalConfiguracao = () => {
    setModalAberto(false);
  };

  const atualizarAlocacao = (index: number, campo: keyof AlocacaoFormRow, valor: string) => {
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
    }

    const payload = montarPayloadConfiguracaoEscala(postoModal, alocacoes);

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

  return {
    dataExtenso,
    postos,
    postoAtivo,
    setPostoAtivo,
    modalAberto,
    abrirModalConfiguracao,
    fecharModalConfiguracao,
    postoModal,
    setPostoModal,
    erroModal,
    alocacoes,
    filtrarMembros,
    atualizarAlocacao,
    adicionarAlocacao,
    removerAlocacao,
    salvarConfiguracao,
    isSalvandoConfiguracao: configurarEscalaMutation.isPending,
    linhasEscala: escalasQuery.data ?? [],
    isCarregandoEscalas: escalasQuery.isLoading,
    inlineDrafts,
    atualizarInline,
    salvarInlineNoBlur,
  };
};
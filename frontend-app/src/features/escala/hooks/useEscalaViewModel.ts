import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  atualizarEscalaService,
  buscarMembrosEscalaService,
  configurarPostoEscalaService,
  listarEscalasPorPostoService,
} from '../services/escalas.service';
import type {
  AlocacaoFormRow,
  CampoEditavel,
  ConfigurarEscalaPayload,
  EscalaLinha,
  InlineDraft,
  MembroEscalaOption,
} from '../types/escala.types';
import {
  criarAlocacaoVazia,
  criarAlocacoesIniciais,
  criarInlineDrafts,
  filtrarMembrosPorTermo,
  labelDoMembro,
  montarPayloadConfiguracao,
  POSTOS_INICIAIS,
} from '../utils/escala.helpers';
import { gerarPdfEscala } from '../utils/escalaPdf';

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
    queryFn: () => buscarMembrosEscalaService({ limit: 50 }),
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
      map.set(labelDoMembro(membro), membro);
    });
    return map;
  }, [membrosQuery.data]);

  const filtrarMembros = (termo: string): MembroEscalaOption[] => {
    return filtrarMembrosPorTermo(termo, membrosQuery.data ?? []);
  };

  useEffect(() => {
    setInlineDrafts(criarInlineDrafts(escalasQuery.data ?? []));
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

    const payload: ConfigurarEscalaPayload = montarPayloadConfiguracao(postoModal, alocacoes);

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

  const linhasEscala = escalasQuery.data ?? [];

  const gerarPdfAtual = () => {
    gerarPdfEscala({
      dataExtenso,
      posto: postoAtivo,
      linhas: linhasEscala,
    });
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
    gerarPdfAtual,
    isSalvandoConfiguracao: configurarEscalaMutation.isPending,
    linhasEscala,
    isCarregandoEscalas: escalasQuery.isLoading,
    inlineDrafts,
    atualizarInline,
    salvarInlineNoBlur,
  };
};
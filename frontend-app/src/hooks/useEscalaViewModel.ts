import { useMemo, useState } from 'react';
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
  criarAlocacoesIniciais,
  criarInlineDrafts,
  deduplicarMembrosPorNr,
  filtrarMembrosPorTermo,
  labelDoMembro,
  montarPayloadConfiguracao,
  POSTOS_INICIAIS,
} from '../utils/escala.helpers';
import { gerarPdfEscala } from '../utils/escalaPdf';
import {
  FIM_TERCEIRO_HORARIO_PADRAO,
  INICIO_PRIMEIRO_HORARIO_PADRAO,
  janelaHorariosValida,
} from '../utils/turno';

export const useEscalaViewModel = () => {
  const queryClient = useQueryClient();
  const [postoAtivo, setPostoAtivo] = useState<string>(POSTOS_INICIAIS[0]);
  const [modalAberto, setModalAberto] = useState(false);
  const [postoModal, setPostoModal] = useState<string>(POSTOS_INICIAIS[0]);
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [alocacoes, setAlocacoes] = useState<AlocacaoFormRow[]>(criarAlocacoesIniciais);
  const [inicioPrimeiroHorario, setInicioPrimeiroHorario] = useState<string>(
    INICIO_PRIMEIRO_HORARIO_PADRAO,
  );
  const [fimTerceiroHorario, setFimTerceiroHorario] = useState<string>(
    FIM_TERCEIRO_HORARIO_PADRAO,
  );
  const [inlineDraftsUsuario, setInlineDraftsUsuario] = useState<Record<string, InlineDraft>>({});

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

  const membrosDisponiveis = useMemo(() => {
    return deduplicarMembrosPorNr(membrosQuery.data ?? []);
  }, [membrosQuery.data]);

  const membrosPorLabel = useMemo(() => {
    const map = new Map<string, MembroEscalaOption>();
    membrosDisponiveis.forEach((membro) => {
      map.set(labelDoMembro(membro), membro);
    });
    return map;
  }, [membrosDisponiveis]);

  const filtrarMembros = (termo: string): MembroEscalaOption[] => {
    return filtrarMembrosPorTermo(termo, membrosDisponiveis);
  };

  const inlineDraftsCalculados = useMemo(() => {
    return criarInlineDrafts(escalasQuery.data ?? []);
  }, [escalasQuery.data]);

  const inlineDrafts = useMemo(() => {
    return { ...inlineDraftsCalculados, ...inlineDraftsUsuario };
  }, [inlineDraftsCalculados, inlineDraftsUsuario]);

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
    setInicioPrimeiroHorario(INICIO_PRIMEIRO_HORARIO_PADRAO);
    setFimTerceiroHorario(FIM_TERCEIRO_HORARIO_PADRAO);
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

  const salvarConfiguracao = () => {
    if (!postoModal.trim()) {
      setErroModal('Selecione um posto antes de salvar.');
      return;
    }

    if (alocacoes.length === 0) {
      setErroModal('Adicione pelo menos uma alocacao.');
      return;
    }

    const alocacoesComTurno = alocacoes.map((alocacao, index) => ({
      ...alocacao,
      turno: index + 1,
    }));

    const alocacoesHorarios = alocacoesComTurno.filter((alocacao) => alocacao.turno <= 3);
    const alocacaoPermanencia = alocacoesComTurno.find((alocacao) => alocacao.turno === 4);

    const horariosPreenchidos = alocacoesHorarios.filter((alocacao) =>
      Boolean(alocacao.membroGuarnicaoId),
    );
    const algumHorarioPreenchido = horariosPreenchidos.length > 0;

    if (algumHorarioPreenchido && horariosPreenchidos.length !== alocacoesHorarios.length) {
      setErroModal('Ao preencher horários, informe 1°, 2° e 3° Horário.');
      return;
    }

    if (algumHorarioPreenchido) {
      if (!inicioPrimeiroHorario || !fimTerceiroHorario) {
        setErroModal('Informe início do 1° horário e fim do 3° horário.');
        return;
      }

      if (!janelaHorariosValida(inicioPrimeiroHorario, fimTerceiroHorario)) {
        setErroModal('A janela deve fechar ciclos completos de 6h (múltiplos de 6h).');
        return;
      }
    }

    if (!algumHorarioPreenchido && !alocacaoPermanencia?.membroGuarnicaoId) {
      setErroModal('Permanência é obrigatória quando nenhum horário for preenchido.');
      return;
    }

    const payload: ConfigurarEscalaPayload = montarPayloadConfiguracao(
      postoModal,
      alocacoes,
      algumHorarioPreenchido ? inicioPrimeiroHorario : undefined,
      algumHorarioPreenchido ? fimTerceiroHorario : undefined,
    );

    configurarEscalaMutation.mutate(payload, {
      onError: () => {
        setErroModal('Nao foi possivel salvar a configuracao. Verifique os dados e tente novamente.');
      },
    });
  };

  const atualizarInline = (id: string, campo: CampoEditavel, valor: string) => {
    setInlineDraftsUsuario((atual) => {
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
    inicioPrimeiroHorario,
    setInicioPrimeiroHorario,
    fimTerceiroHorario,
    setFimTerceiroHorario,
    erroModal,
    alocacoes,
    filtrarMembros,
    atualizarAlocacao,
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
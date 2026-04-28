import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { configurarPostoEscalaService } from '../services/escalas.service';
import type { AlocacaoFormRow, ConfigurarEscalaPayload, MembroEscalaOption } from '../types/escala.types';
import {
  criarAlocacoesIniciais,
  montarPayloadConfiguracao,
} from '../utils/escala.helpers';
import {
  FIM_TERCEIRO_HORARIO_PADRAO,
  INICIO_PRIMEIRO_HORARIO_PADRAO,
  janelaHorariosValida,
} from '../utils/turno';

const validaConfiguracao = (
  alocacoes: AlocacaoFormRow[],
  inicioPrimeiroHorario: string,
  fimTerceiroHorario: string,
) => {
  if (alocacoes.length === 0) {
    return 'Adicione pelo menos uma alocacao.';
  }

  const alocacoesComTurno = alocacoes.map((alocacao, index) => ({
    ...alocacao,
    turno: index + 1,
  }));

  const alocacoesHorarios = alocacoesComTurno.filter((alocacao) => alocacao.turno <= 3);
  const alocacaoPermanencia = alocacoesComTurno.find((alocacao) => alocacao.turno === 4);

  const horariosPreenchidos = alocacoesHorarios.filter((alocacao) => Boolean(alocacao.membroGuarnicaoId));
  const algumHorarioPreenchido = horariosPreenchidos.length > 0;

  if (algumHorarioPreenchido && horariosPreenchidos.length !== alocacoesHorarios.length) {
    return 'Ao preencher horários, informe 1°, 2° e 3° Horário.';
  }

  if (algumHorarioPreenchido) {
    if (!inicioPrimeiroHorario || !fimTerceiroHorario) {
      return 'Informe início do 1° horário e fim do 3° horário.';
    }

    if (!janelaHorariosValida(inicioPrimeiroHorario, fimTerceiroHorario)) {
      return 'A janela deve fechar ciclos completos de 6h (múltiplos de 6h).';
    }
  }

  if (!algumHorarioPreenchido && !alocacaoPermanencia?.membroGuarnicaoId) {
    return 'Permanência é obrigatória quando nenhum horário for preenchido.';
  }

  return null;
};

export const useEscalaConfiguracao = (
  postoAtivo: string,
  setPostoAtivo: (posto: string) => void,
  membrosPorLabel: Map<string, MembroEscalaOption>,
) => {
  const queryClient = useQueryClient();
  const [modalAberto, setModalAberto] = useState(false);
  const [postoModal, setPostoModal] = useState<string>(postoAtivo);
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [alocacoes, setAlocacoes] = useState<AlocacaoFormRow[]>(criarAlocacoesIniciais);
  const [inicioPrimeiroHorario, setInicioPrimeiroHorario] = useState<string>(INICIO_PRIMEIRO_HORARIO_PADRAO);
  const [fimTerceiroHorario, setFimTerceiroHorario] = useState<string>(FIM_TERCEIRO_HORARIO_PADRAO);

  const configurarEscalaMutation = useMutation({
    mutationFn: (payload: ConfigurarEscalaPayload) => configurarPostoEscalaService(payload),
    onSuccess: async (_data, payload) => {
      setModalAberto(false);
      setErroModal(null);
      setPostoAtivo(payload.posto);
      await queryClient.invalidateQueries({ queryKey: ['escalas'] });
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
          const membroSelecionado = membrosPorLabel.get(valor) ?? null;
          proximaLinha.membroGuarnicaoId = membroSelecionado?.id ?? '';
        }

        return proximaLinha;
      });
    });
  };

  const salvarConfiguracao = () => {
    const erro = validaConfiguracao(
      alocacoes,
      inicioPrimeiroHorario,
      fimTerceiroHorario,
    );

    if (erro) {
      setErroModal(erro);
      return;
    }

    const payload: ConfigurarEscalaPayload = montarPayloadConfiguracao(
      postoModal,
      alocacoes,
      alocacoes.some((alocacao) => Boolean(alocacao.membroGuarnicaoId)) ? inicioPrimeiroHorario : undefined,
      alocacoes.some((alocacao) => Boolean(alocacao.membroGuarnicaoId)) ? fimTerceiroHorario : undefined,
    );

    configurarEscalaMutation.mutate(payload, {
      onError: () => {
        setErroModal('Nao foi possivel salvar a configuracao. Verifique os dados e tente novamente.');
      },
    });
  };

  return {
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
    atualizarAlocacao,
    salvarConfiguracao,
    isSalvandoConfiguracao: configurarEscalaMutation.isPending,
  };
};

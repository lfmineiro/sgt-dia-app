import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type {
  AtualizarEscalaInput,
  ConfigurarEscalaInput,
  ListarEscalasPorPostoQuery,
  ListarMembrosEscalaQuery,
} from "../schemas/escalas.schemas.js";

export interface EscalaLinhaView {
  id: string;
  membroGuarnicaoId: string;
  posto: string;
  turno: number;
  horario: string;
  aluno: string;
  quarto: string | null;
  cama: string | null;
  nr: number;
}

export interface MembroEscalaOption {
  id: string;
  servicoId: string;
  funcao: string;
  nr: number;
  alunoNomeGuerra: string;
  alunoNomeCompleto: string;
  label: string;
}

type EscalaComAluno = Prisma.EscalaGetPayload<{
  include: {
    membroGuarnicao: {
      include: {
        aluno: {
          select: {
            numero: true;
            nomeGuerra: true;
          };
        };
      };
    };
  };
}>;

type EscalaComAlunoEServico = Prisma.EscalaGetPayload<{
  include: {
    membroGuarnicao: {
      include: {
        aluno: {
          select: {
            numero: true;
            nomeGuerra: true;
          };
        };
        servico: {
          select: {
            id: true;
            data: true;
          };
        };
      };
    };
  };
}>;

const mapEscalaLinha = (escala: EscalaComAluno): EscalaLinhaView => {
  const horario = gerarIntervaloPorTurno(
    escala.turno,
    escala.inicioPrimeiroHorario,
    escala.fimTerceiroHorario,
  );

  return {
    id: escala.id,
    membroGuarnicaoId: escala.membroGuarnicaoId,
    posto: escala.posto,
    turno: escala.turno,
    horario,
    aluno: escala.membroGuarnicao.aluno.nomeGuerra,
    quarto: escala.quarto,
    cama: escala.cama,
    nr: escala.membroGuarnicao.aluno.numero,
  };
};

const INICIO_PRIMEIRO_HORARIO_PADRAO = "08:00";
const DURACAO_HORARIO_EM_MINUTOS = 120;
const TOTAL_HORARIOS_PLANTAO = 3;
const TURNO_PERMANENCIA = 4;
const MINUTOS_POR_DIA = 24 * 60;
const DURACAO_CICLO_EM_MINUTOS =
  DURACAO_HORARIO_EM_MINUTOS * TOTAL_HORARIOS_PLANTAO;

const formatarHorario = (totalMinutos: number): string => {
  const minutosNormalizados =
    ((totalMinutos % MINUTOS_POR_DIA) + MINUTOS_POR_DIA) % MINUTOS_POR_DIA;
  const hora = Math.floor(minutosNormalizados / 60);
  const minuto = minutosNormalizados % 60;

  return `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`;
};

const converterHorarioParaMinutos = (horario?: string | null): number | null => {
  if (!horario) return null;

  const [horaTexto, minutoTexto] = horario.split(":");
  const hora = Number(horaTexto);
  const minuto = Number(minutoTexto);

  if (!Number.isInteger(hora) || !Number.isInteger(minuto)) return null;
  if (hora < 0 || hora > 23 || minuto < 0 || minuto > 59) return null;

  return hora * 60 + minuto;
};

const calcularDuracaoJanela = (
  inicioPrimeiroHorario?: string | null,
  fimTerceiroHorario?: string | null,
): number | null => {
  const inicio = converterHorarioParaMinutos(inicioPrimeiroHorario);
  const fim = converterHorarioParaMinutos(fimTerceiroHorario);

  if (inicio === null || fim === null) return null;

  let duracao = fim - inicio;
  if (duracao <= 0) {
    duracao += MINUTOS_POR_DIA;
  }

  return duracao;
};

const intervaloHorariosValido = (
  inicioPrimeiroHorario?: string | null,
  fimTerceiroHorario?: string | null,
): boolean => {
  const duracao = calcularDuracaoJanela(inicioPrimeiroHorario, fimTerceiroHorario);

  if (duracao === null) return false;

  return duracao >= DURACAO_CICLO_EM_MINUTOS && duracao % DURACAO_CICLO_EM_MINUTOS === 0;
};

const obterInicioPadraoEmMinutos = (): number => {
  const inicioPadrao = converterHorarioParaMinutos(INICIO_PRIMEIRO_HORARIO_PADRAO);
  return inicioPadrao ?? 8 * 60;
};

const gerarIntervaloPorTurno = (
  turno: number,
  inicioPrimeiroHorario?: string | null,
  fimTerceiroHorario?: string | null,
): string => {
  if (turno === TURNO_PERMANENCIA) {
    return "Permanência";
  }

  if (turno < 1 || turno > TOTAL_HORARIOS_PLANTAO) {
    return `Turno ${turno}`;
  }

  const inicioConfigurado = converterHorarioParaMinutos(inicioPrimeiroHorario);
  const inicioBase = inicioConfigurado ?? obterInicioPadraoEmMinutos();
  const duracaoJanela = calcularDuracaoJanela(
    inicioPrimeiroHorario,
    fimTerceiroHorario,
  );
  const duracaoTotal =
    duracaoJanela !== null &&
      intervaloHorariosValido(inicioPrimeiroHorario, fimTerceiroHorario)
      ? duracaoJanela
      : DURACAO_CICLO_EM_MINUTOS;

  const totalBlocos = Math.floor(duracaoTotal / DURACAO_HORARIO_EM_MINUTOS);
  const intervalosDoTurno: string[] = [];

  for (let blocoIndex = 0; blocoIndex < totalBlocos; blocoIndex += 1) {
    const turnoDoBloco = (blocoIndex % TOTAL_HORARIOS_PLANTAO) + 1;
    if (turnoDoBloco !== turno) {
      continue;
    }

    const inicioTurno = inicioBase + blocoIndex * DURACAO_HORARIO_EM_MINUTOS;
    const fimTurno = inicioTurno + DURACAO_HORARIO_EM_MINUTOS;
    intervalosDoTurno.push(
      `${formatarHorario(inicioTurno)}-${formatarHorario(fimTurno)}`,
    );
  }

  if (intervalosDoTurno.length === 0) {
    const inicioTurno = inicioBase + (turno - 1) * DURACAO_HORARIO_EM_MINUTOS;
    const fimTurno = inicioTurno + DURACAO_HORARIO_EM_MINUTOS;
    return `${formatarHorario(inicioTurno)}-${formatarHorario(fimTurno)}`;
  }

  return intervalosDoTurno.join(" | ");
};

const obterServicoIdParaListagem = async (
  servicoId?: string,
): Promise<string | undefined> => {
  if (servicoId) return servicoId;

  const servicoMaisRecente = await prisma.servico.findFirst({
    select: {
      id: true,
    },
    orderBy: {
      data: "desc",
    },
  });

  return servicoMaisRecente?.id;
};

const HORARIOS_PLANTAO = [1, 2, 3] as const;

const grupoEscalaValido = (escalas: EscalaComAlunoEServico[]): boolean => {
  if (escalas.length === 0) return false;

  const turnos = new Set(escalas.map((escala) => escala.turno));
  const algumHorario = HORARIOS_PLANTAO.some((turno) => turnos.has(turno));

  if (algumHorario) {
    return HORARIOS_PLANTAO.every((turno) => turnos.has(turno));
  }

  return turnos.has(TURNO_PERMANENCIA);
};

const selecionarEscalasDoServicoAlvo = (
  escalas: EscalaComAlunoEServico[],
): EscalaComAlunoEServico[] => {
  const escalasPorServico = new Map<
    string,
    { dataServico: Date; linhas: EscalaComAlunoEServico[] }
  >();

  for (const escala of escalas) {
    const servicoId = escala.membroGuarnicao.servicoId;
    const dataServico = escala.membroGuarnicao.servico.data;
    const grupo = escalasPorServico.get(servicoId);

    if (grupo) {
      grupo.linhas.push(escala);
      continue;
    }

    escalasPorServico.set(servicoId, {
      dataServico,
      linhas: [escala],
    });
  }

  const gruposOrdenados = [...escalasPorServico.values()].sort(
    (a, b) => b.dataServico.getTime() - a.dataServico.getTime(),
  );

  const grupoMaisRecenteValido = gruposOrdenados.find((grupo) =>
    grupoEscalaValido(grupo.linhas),
  );

  return (grupoMaisRecenteValido ?? gruposOrdenados[0])?.linhas ?? [];
};

export const configurarEscalaService = async (
  input: ConfigurarEscalaInput,
): Promise<EscalaLinhaView[]> => {
  const alocacoesComTurno = input.alocacoes
    .map((alocacao, index) => ({
      ...alocacao,
      turno: alocacao.turno ?? index + 1,
    }))
    .sort((a, b) => a.turno - b.turno);

  const alocacoesHorarios = alocacoesComTurno.filter(
    (alocacao) => alocacao.turno >= 1 && alocacao.turno <= TOTAL_HORARIOS_PLANTAO,
  );
  const alocacaoPermanencia = alocacoesComTurno.find(
    (alocacao) => alocacao.turno === TURNO_PERMANENCIA,
  );

  const horariosPreenchidos = alocacoesHorarios.filter(
    (alocacao) => Boolean(alocacao.membroGuarnicaoId),
  );
  const algumHorarioPreenchido = horariosPreenchidos.length > 0;
  const permanenciaPreenchida = Boolean(alocacaoPermanencia?.membroGuarnicaoId);

  if (algumHorarioPreenchido && horariosPreenchidos.length !== alocacoesHorarios.length) {
    throw new Error("HORARIOS_INCOMPLETOS");
  }

  if (!algumHorarioPreenchido && !permanenciaPreenchida) {
    throw new Error("PERMANENCIA_OBRIGATORIA");
  }

  if (algumHorarioPreenchido) {
    if (!input.inicioPrimeiroHorario || !input.fimTerceiroHorario) {
      throw new Error("HORARIOS_DEFINICAO_OBRIGATORIA");
    }

    if (!intervaloHorariosValido(input.inicioPrimeiroHorario, input.fimTerceiroHorario)) {
      throw new Error("INTERVALO_HORARIOS_INVALIDO");
    }
  }

  const alocacoesSelecionadas = alocacoesComTurno.filter((alocacao) =>
    Boolean(alocacao.membroGuarnicaoId),
  );

  const membroIds = alocacoesSelecionadas
    .map((alocacao) => alocacao.membroGuarnicaoId)
    .filter((id): id is string => Boolean(id));

  if (membroIds.length === 0) {
    throw new Error("NENHUMA_ALOCACAO_SELECIONADA");
  }

  const membrosUnicos = new Set(membroIds);

  if (membrosUnicos.size !== membroIds.length) {
    throw new Error("MEMBRO_REPETIDO_NA_CONFIGURACAO");
  }

  const membros = await prisma.membroGuarnicao.findMany({
    where: {
      id: {
        in: [...membrosUnicos],
      },
    },
    include: {
      aluno: {
        select: {
          numero: true,
          nomeGuerra: true,
        },
      },
    },
  });

  if (membros.length !== membrosUnicos.size) {
    throw new Error("MEMBRO_GUARNICAO_NAO_ENCONTRADO");
  }

  const servicos = new Set(membros.map((membro) => membro.servicoId));
  if (servicos.size > 1) {
    throw new Error("MEMBROS_DE_SERVICOS_DIFERENTES");
  }

  const servicoId = membros[0]?.servicoId;
  if (!servicoId) {
    throw new Error("MEMBRO_GUARNICAO_NAO_ENCONTRADO");
  }

  const alocacaoPorMembro = new Map(
    alocacoesSelecionadas
      .filter(
        (
          alocacao,
        ): alocacao is typeof alocacao & { membroGuarnicaoId: string } =>
          Boolean(alocacao.membroGuarnicaoId),
      )
      .map((alocacao) => [alocacao.membroGuarnicaoId, alocacao]),
  );

  const escalasCriadas = await prisma.$transaction(async (tx) => {
    const escalasExistentes = await tx.escala.findMany({
      where: {
        posto: input.posto,
        membroGuarnicao: {
          servicoId,
        },
      },
      select: {
        id: true,
      },
    });

    if (escalasExistentes.length > 0) {
      await tx.escala.deleteMany({
        where: {
          id: {
            in: escalasExistentes.map((escala) => escala.id),
          },
        },
      });
    }

    const criadas: EscalaComAluno[] = [];
    for (const membro of membros) {
      const alocacao = alocacaoPorMembro.get(membro.id);
      if (!alocacao) continue;

      const escalaCriada = await tx.escala.create({
        data: {
          membroGuarnicaoId: membro.id,
          posto: input.posto,
          turno: alocacao.turno,
          inicioPrimeiroHorario: algumHorarioPreenchido
            ? input.inicioPrimeiroHorario ?? null
            : null,
          fimTerceiroHorario: algumHorarioPreenchido
            ? input.fimTerceiroHorario ?? null
            : null,
          quarto: alocacao.quarto ?? null,
          cama: alocacao.cama ?? null,
        },
        include: {
          membroGuarnicao: {
            include: {
              aluno: {
                select: {
                  numero: true,
                  nomeGuerra: true,
                },
              },
            },
          },
        },
      });

      criadas.push(escalaCriada);
    }

    return criadas;
  });

  return escalasCriadas
    .sort((a, b) => a.turno - b.turno)
    .map((escala) => mapEscalaLinha(escala));
};

export const listarEscalasPorPostoService = async (
  posto: string,
  servicoId?: ListarEscalasPorPostoQuery["servicoId"],
): Promise<EscalaLinhaView[]> => {
  const escalas = await prisma.escala.findMany({
    where: {
      posto: {
        equals: posto,
        mode: "insensitive",
      },
    },
    include: {
      membroGuarnicao: {
        include: {
          aluno: {
            select: {
              numero: true,
              nomeGuerra: true,
            },
          },
          servico: {
            select: {
              id: true,
              data: true,
            },
          },
        },
      },
    },
    orderBy: [{ turno: "asc" }],
  });

  const escalasFiltradas = servicoId
    ? escalas.filter((escala) => escala.membroGuarnicao.servicoId === servicoId)
    : selecionarEscalasDoServicoAlvo(escalas);

  return escalasFiltradas
    .sort((a, b) => a.turno - b.turno)
    .map((escala) => mapEscalaLinha(escala));
};

export const atualizarEscalaService = async (
  id: string,
  dados: AtualizarEscalaInput,
): Promise<EscalaLinhaView> => {
  const escalaExistente = await prisma.escala.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!escalaExistente) {
    throw new Error("ESCALA_NAO_ENCONTRADA");
  }

  const escalaAtualizada = await prisma.escala.update({
    where: { id },
    data: dados,
    include: {
      membroGuarnicao: {
        include: {
          aluno: {
            select: {
              numero: true,
              nomeGuerra: true,
            },
          },
        },
      },
    },
  });

  return mapEscalaLinha(escalaAtualizada);
};

export const listarMembrosEscalaService = async (
  input: ListarMembrosEscalaQuery,
): Promise<MembroEscalaOption[]> => {
  const servicoId = await obterServicoIdParaListagem(input.servicoId);

  const where: Prisma.MembroGuarnicaoWhereInput = {
    ...(servicoId ? { servicoId } : {}),
  };

  if (input.busca) {
    const busca = input.busca.trim();
    const numeroBuscado = Number(busca);
    const filtrosOR: Prisma.MembroGuarnicaoWhereInput[] = [
      {
        aluno: {
          nomeGuerra: {
            contains: busca,
            mode: "insensitive",
          },
        },
      },
      {
        aluno: {
          nomeCompleto: {
            contains: busca,
            mode: "insensitive",
          },
        },
      },
    ];

    if (Number.isInteger(numeroBuscado)) {
      filtrosOR.push({
        alunoNumero: numeroBuscado,
      });
    }

    where.OR = filtrosOR;
  }

  const membros = await prisma.membroGuarnicao.findMany({
    where,
    include: {
      aluno: {
        select: {
          numero: true,
          nomeGuerra: true,
          nomeCompleto: true,
        },
      },
    },
    orderBy: {
      alunoNumero: "asc",
    },
  });

  const membrosUnicosPorNr = new Map<number, (typeof membros)[number]>();
  for (const membro of membros) {
    if (!membrosUnicosPorNr.has(membro.alunoNumero)) {
      membrosUnicosPorNr.set(membro.alunoNumero, membro);
    }
  }

  const membrosUnicos = [...membrosUnicosPorNr.values()].slice(0, input.limit);

  return membrosUnicos.map((membro) => ({
    id: membro.id,
    servicoId: membro.servicoId,
    funcao: membro.funcao,
    nr: membro.aluno.numero,
    alunoNomeGuerra: membro.aluno.nomeGuerra,
    alunoNomeCompleto: membro.aluno.nomeCompleto,
    label: `${membro.aluno.numero} - ${membro.aluno.nomeGuerra}`,
  }));
};
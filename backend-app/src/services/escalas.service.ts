import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type {
  AtualizarEscalaInput,
  ConfigurarEscalaInput,
  ListarEscalasPorPostoQuery,
  ListarMembrosEscalaQuery,
} from "../schemas/escalas.schemas.js";
import {
  gerarIntervaloPorTurno,
  intervaloHorariosValido,
  selecionarEscalasDoServicoAlvo,
  TOTAL_HORARIOS_PLANTAO,
  TURNO_PERMANENCIA,
} from "./escalas.helpers.js";

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
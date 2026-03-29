import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import type {
  AtualizarEscalaInput,
  ConfigurarEscalaInput,
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

const mapEscalaLinha = (escala: EscalaComAluno): EscalaLinhaView => {
  const horario = gerarIntervaloPorTurno(escala.turno);

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

const formatarHoraCheia = (hora: number): string => {
  const horaNormalizada = ((hora % 24) + 24) % 24;
  return `${String(horaNormalizada).padStart(2, "0")}:00`;
};

const gerarIntervaloPorTurno = (turno: number): string => {
  const turnoNormalizado = Math.max(1, turno);
  const horaInicio = 8 + (turnoNormalizado - 1) * 2;
  const horaFim = horaInicio + 2;

  return `${formatarHoraCheia(horaInicio)}-${formatarHoraCheia(horaFim)}`;
};

export const configurarEscalaService = async (
  input: ConfigurarEscalaInput,
): Promise<EscalaLinhaView[]> => {
  const membroIds = input.alocacoes.map((alocacao) => alocacao.membroGuarnicaoId);
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
    input.alocacoes.map((alocacao, index) => [alocacao.membroGuarnicaoId, { alocacao, index }]),
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
      const entrada = alocacaoPorMembro.get(membro.id);
      if (!entrada) continue;

      const { alocacao, index } = entrada;
      const escalaCriada = await tx.escala.create({
        data: {
          membroGuarnicaoId: membro.id,
          posto: input.posto,
          turno: alocacao.turno ?? index + 1,
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
        },
      },
    },
    orderBy: [{ turno: "asc" }],
  });

  return escalas.map((escala) => mapEscalaLinha(escala));
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
  const where: Prisma.MembroGuarnicaoWhereInput = {
    ...(input.servicoId ? { servicoId: input.servicoId } : {}),
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
    take: input.limit,
  });

  return membros.map((membro) => ({
    id: membro.id,
    servicoId: membro.servicoId,
    funcao: membro.funcao,
    nr: membro.aluno.numero,
    alunoNomeGuerra: membro.aluno.nomeGuerra,
    alunoNomeCompleto: membro.aluno.nomeCompleto,
    label: `${membro.aluno.numero} - ${membro.aluno.nomeGuerra}`,
  }));
};
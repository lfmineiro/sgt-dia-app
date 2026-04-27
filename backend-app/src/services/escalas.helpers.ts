const INICIO_PRIMEIRO_HORARIO_PADRAO = "08:00";
const DURACAO_HORARIO_EM_MINUTOS = 120;
const MINUTOS_POR_DIA = 24 * 60;

export const TOTAL_HORARIOS_PLANTAO = 3;
export const TURNO_PERMANENCIA = 4;

const DURACAO_CICLO_EM_MINUTOS =
  DURACAO_HORARIO_EM_MINUTOS * TOTAL_HORARIOS_PLANTAO;
const HORARIOS_PLANTAO = [1, 2, 3] as const;

export interface EscalaComServicoBasica {
  turno: number;
  membroGuarnicao: {
    servicoId: string;
    servico: {
      data: Date;
    };
  };
}

export const isTurnoHorario = (turno: number): boolean =>
  turno >= 1 && turno <= TOTAL_HORARIOS_PLANTAO;

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

export const intervaloHorariosValido = (
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

export const gerarIntervaloPorTurno = (
  turno: number,
  inicioPrimeiroHorario?: string | null,
  fimTerceiroHorario?: string | null,
): string => {
  if (turno === TURNO_PERMANENCIA) {
    return "Permanência";
  }

  if (!isTurnoHorario(turno)) {
    return `Turno ${turno}`;
  }

  const inicioConfigurado = converterHorarioParaMinutos(inicioPrimeiroHorario);
  const inicioBase = inicioConfigurado ?? obterInicioPadraoEmMinutos();
  const duracaoJanela = calcularDuracaoJanela(
    inicioPrimeiroHorario,
    fimTerceiroHorario,
  );
  const duracaoTotal =
    duracaoJanela !== null && intervaloHorariosValido(inicioPrimeiroHorario, fimTerceiroHorario)
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

const grupoEscalaValido = <T extends EscalaComServicoBasica>(escalas: T[]): boolean => {
  if (escalas.length === 0) return false;

  const turnos = new Set(escalas.map((escala) => escala.turno));
  const algumHorario = HORARIOS_PLANTAO.some((turno) => turnos.has(turno));

  if (algumHorario) {
    return HORARIOS_PLANTAO.every((turno) => turnos.has(turno));
  }

  return turnos.has(TURNO_PERMANENCIA);
};

export const selecionarEscalasDoServicoAlvo = <T extends EscalaComServicoBasica>(
  escalas: T[],
): T[] => {
  const escalasPorServico = new Map<
    string,
    { dataServico: Date; linhas: T[] }
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
export const INICIO_PRIMEIRO_HORARIO_PADRAO = '08:00';
export const FIM_TERCEIRO_HORARIO_PADRAO = '14:00';
export const DURACAO_HORARIO_EM_MINUTOS = 120;
export const TOTAL_HORARIOS_PLANTAO = 3;
export const TURNO_PERMANENCIA = 4;
export const TOTAL_TURNOS_ESCALA = 4;
const MINUTOS_POR_DIA = 24 * 60;
const DURACAO_CICLO_EM_MINUTOS = TOTAL_HORARIOS_PLANTAO * DURACAO_HORARIO_EM_MINUTOS;

const HORARIO_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const ehTurnoPlantao = (turno: number): boolean => {
  return turno >= 1 && turno <= TOTAL_HORARIOS_PLANTAO;
};

const converterHorarioParaMinutos = (horario?: string | null): number | null => {
  if (!horario || !HORARIO_REGEX.test(horario)) return null;

  const [horaTexto, minutoTexto] = horario.split(':');
  const hora = Number(horaTexto);
  const minuto = Number(minutoTexto);

  return hora * 60 + minuto;
};

const formatarHorario = (totalMinutos: number): string => {
  const minutosNormalizados = ((totalMinutos % MINUTOS_POR_DIA) + MINUTOS_POR_DIA) % MINUTOS_POR_DIA;
  const hora = Math.floor(minutosNormalizados / 60);
  const minuto = minutosNormalizados % 60;

  return `${String(hora).padStart(2, '0')}:${String(minuto).padStart(2, '0')}`;
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

export const janelaHorariosValida = (
  inicioPrimeiroHorario?: string | null,
  fimTerceiroHorario?: string | null,
): boolean => {
  const duracao = calcularDuracaoJanela(inicioPrimeiroHorario, fimTerceiroHorario);

  if (duracao === null) return false;

  return duracao >= DURACAO_CICLO_EM_MINUTOS && duracao % DURACAO_CICLO_EM_MINUTOS === 0;
};

const obterInicioBase = (
  inicioPrimeiroHorario?: string | null,
): number => {
  const inicio = converterHorarioParaMinutos(inicioPrimeiroHorario);
  if (inicio !== null) return inicio;

  return converterHorarioParaMinutos(INICIO_PRIMEIRO_HORARIO_PADRAO) ?? 8 * 60;
};

export const gerarIntervaloPorTurno = (
  turno: number,
  inicioPrimeiroHorario?: string | null,
  fimTerceiroHorario?: string | null,
): string => {
  if (turno === TURNO_PERMANENCIA) {
    return 'Permanência';
  }

  if (!ehTurnoPlantao(turno)) {
    return `Turno ${turno}`;
  }

  const inicioBase = obterInicioBase(inicioPrimeiroHorario);
  const duracaoJanela = calcularDuracaoJanela(inicioPrimeiroHorario, fimTerceiroHorario);
  const duracaoTotal =
    duracaoJanela !== null && janelaHorariosValida(inicioPrimeiroHorario, fimTerceiroHorario)
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
    intervalosDoTurno.push(`${formatarHorario(inicioTurno)}-${formatarHorario(fimTurno)}`);
  }

  if (intervalosDoTurno.length === 0) {
    const inicioTurno = inicioBase + (turno - 1) * DURACAO_HORARIO_EM_MINUTOS;
    const fimTurno = inicioTurno + DURACAO_HORARIO_EM_MINUTOS;
    return `${formatarHorario(inicioTurno)}-${formatarHorario(fimTurno)}`;
  }

  return intervalosDoTurno.join(' | ');
};

export const obterNomeTurno = (turno: number): string => {
  if (ehTurnoPlantao(turno)) {
    return `${turno}° Horário`;
  }

  if (turno === TURNO_PERMANENCIA) {
    return 'Permanência';
  }

  return `Turno ${turno}`;
};

export const obterDescricaoTurno = (
  turno: number,
  inicioPrimeiroHorario?: string | null,
  fimTerceiroHorario?: string | null,
): string => {
  const nomeTurno = obterNomeTurno(turno);
  if (turno === TURNO_PERMANENCIA) {
    return nomeTurno;
  }

  return `${nomeTurno} - ${gerarIntervaloPorTurno(turno, inicioPrimeiroHorario, fimTerceiroHorario)}`;
};
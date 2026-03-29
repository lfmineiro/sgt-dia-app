const formatarHoraCheia = (hora: number): string => {
  const horaNormalizada = ((hora % 24) + 24) % 24;
  return `${String(horaNormalizada).padStart(2, '0')}:00`;
};

export const gerarIntervaloPorTurno = (turno: number): string => {
  const turnoNormalizado = Math.max(1, turno);
  const horaInicio = 8 + (turnoNormalizado - 1) * 2;
  const horaFim = horaInicio + 2;

  return `${formatarHoraCheia(horaInicio)}-${formatarHoraCheia(horaFim)}`;
};
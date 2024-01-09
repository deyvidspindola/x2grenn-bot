import moment from 'moment-timezone';
moment.tz.setDefault('America/Sao_Paulo');

export const extrairNumero = (texto: string) => {
  const regex = /\b(\d+)\b/;
  const match = texto.match(regex);
  return match ? parseInt(match[1], 10) : null;
};

export const formatTeam = (team: string) => {
  const formattedName = team.replace(/\(([^)]+)\)/, (_, name) => `(<b>${name}</b>)`);
  const newTeam = formattedName.replace(' Esports', '');
  return newTeam;
};

export const calcDiff = (ss: string) => {
  const result = ss.split('-');
  return Math.abs(parseInt(result[0]) - parseInt(result[1]));
};

export const _today = (type?: string) => {
  if (type && type == 'br') {
    return moment().format('DD/MM/YYYY');
  }
  return moment().format('YYYY-MM-DD');
};

export const _todayNow = () => {
  const time = moment().format('HH:mm:ss:SSS').toString();
  return new Date(_today() + `T${time.slice(0, 2)}:${time.slice(3, 5)}:${time.slice(6, 8)}.${time.slice(9, 12)}Z`);
};

export const _yesterday = (type?: string) => {
  if (type && type == 'br') {
    return moment().subtract(1, 'days').format('DD/MM/YYYY');
  }
  return moment().subtract(1, 'days').format('YYYY-MM-DD');
};

export const _startDate = (data: string) => {
  return new Date(data + 'T00:00:00.000Z');
};

export const _endDate = (data: string) => {
  return new Date(data + 'T23:59:59.999Z');
};

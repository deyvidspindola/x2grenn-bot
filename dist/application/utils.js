"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._endDate = exports._startDate = exports._yesterday = exports._todayNow = exports._today = exports.calcDiff = exports._diff = exports.formatTeam = exports.extrairNumero = void 0;
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const diffgols_1 = require("../domain/entities/enums/diffgols");
moment_timezone_1.default.tz.setDefault('America/Sao_Paulo');
const extrairNumero = (texto) => {
    const regex = /\b(\d+)\b/;
    const match = texto.match(regex);
    return match ? parseInt(match[1], 10) : null;
};
exports.extrairNumero = extrairNumero;
const formatTeam = (team) => {
    const formattedName = team.replace(/\(([^)]+)\)/, (_, name) => `(<b>${name}</b>)`);
    const newTeam = formattedName.replace(' Esports', '');
    return newTeam;
};
exports.formatTeam = formatTeam;
const _diff = (gameTime) => {
    switch (gameTime) {
        case 8:
            return diffgols_1.DiffGols.EIGHT_MIN;
        case 10:
            return diffgols_1.DiffGols.TEN_MIN;
        case 12:
            return diffgols_1.DiffGols.TWELVE_MIN;
        default:
            return diffgols_1.DiffGols.EIGHT_MIN;
    }
};
exports._diff = _diff;
const calcDiff = (ss, game) => {
    const value = (0, exports._diff)((0, exports.extrairNumero)(game));
    const result = ss.split('-');
    const diff = Math.abs(parseInt(result[0]) - parseInt(result[1]));
    return {
        sum: parseInt(result[0]) + parseInt(result[1]),
        diff: diff,
        result: diff >= value,
    };
};
exports.calcDiff = calcDiff;
const _today = (type) => {
    if (type && type == 'br') {
        return (0, moment_timezone_1.default)().format('DD/MM/YYYY');
    }
    return (0, moment_timezone_1.default)().format('YYYY-MM-DD');
};
exports._today = _today;
const _todayNow = () => {
    const time = (0, moment_timezone_1.default)().format('HH:mm:ss:SSS').toString();
    return new Date((0, exports._today)() + `T${time.slice(0, 2)}:${time.slice(3, 5)}:${time.slice(6, 8)}.${time.slice(9, 12)}Z`);
};
exports._todayNow = _todayNow;
const _yesterday = (type) => {
    if (type && type == 'br') {
        return (0, moment_timezone_1.default)().subtract(1, 'days').format('DD/MM/YYYY');
    }
    return (0, moment_timezone_1.default)().subtract(1, 'days').format('YYYY-MM-DD');
};
exports._yesterday = _yesterday;
const _startDate = (data) => {
    return new Date(data + 'T00:00:00.000Z');
};
exports._startDate = _startDate;
const _endDate = (data) => {
    return new Date(data + 'T23:59:59.999Z');
};
exports._endDate = _endDate;
//# sourceMappingURL=utils.js.map
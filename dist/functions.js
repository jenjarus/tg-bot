"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExchangeInfo = exports.getBeerInfo = exports.getPredict = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const telegraf_1 = require("telegraf");
function getPredict(ctx) {
    const answer = [
        'Да',
        'Нет',
        'Хм, попробуй еще раз'
    ];
    const randomIndex = Math.floor(Math.random() * answer.length);
    ctx.reply(answer[randomIndex]);
}
exports.getPredict = getPredict;
function getBeerInfo(ctx) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const randomIndex = Math.floor(Math.random() * 20);
            const beerData = yield getApiBeer(randomIndex);
            const volumeData = ((_a = beerData === null || beerData === void 0 ? void 0 : beerData.volume) === null || _a === void 0 ? void 0 : _a.value) ? `Объем: ${beerData.volume.value} л\n` : ``;
            const msg = `Название: ${beerData === null || beerData === void 0 ? void 0 : beerData.name}\n${volumeData}Цена: ${beerData === null || beerData === void 0 ? void 0 : beerData.ibu} $`;
            yield ctx.reply(msg, telegraf_1.Markup.inlineKeyboard([
                telegraf_1.Markup.button.url('Перейти к карточке товара', `https://jenjarus.github.io/React-Shop/catalog/${randomIndex}`)
            ]));
        }
        catch (err) {
            ctx.reply(`Приозошла ошибка: ${err}`);
        }
    });
}
exports.getBeerInfo = getBeerInfo;
function getApiBeer(i) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://api.punkapi.com/v2/beers/${i}`;
        const apiResponse = yield (0, node_fetch_1.default)(url);
        const data = yield apiResponse.json();
        return data[0];
    });
}
function getExchangeInfo(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const USD = yield getApiExchange('USD');
            const EUR = yield getApiExchange('EUR');
            const text = `1$ = ${USD} руб.\n1€ = ${EUR} руб.`;
            yield ctx.reply(text);
        }
        catch (err) {
            ctx.reply(`Приозошла ошибка: ${err}`);
        }
    });
}
exports.getExchangeInfo = getExchangeInfo;
function getApiExchange(currency) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://api.exchangerate-api.com/v4/latest/${currency}`;
        const apiResponse = yield (0, node_fetch_1.default)(url);
        const data = yield apiResponse.json();
        return data.rates.RUB;
    });
}

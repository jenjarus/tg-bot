import fetch from "node-fetch";
import {Markup} from 'telegraf';

function getPredict(ctx) {
    const answer = [
        'Да',
        'Нет',
        'Хм, попробуй еще раз'
    ];
    const randomIndex = Math.floor(Math.random() * answer.length);
    ctx.reply(answer[randomIndex]);
}

async function getBeerInfo(ctx) {
    try {
        const randomIndex = Math.floor(Math.random() * 20);
        const beerData = await getApiBeer(randomIndex);
        const volumeData = beerData?.volume?.value ? `Объем: ${beerData.volume.value} л\n` : ``;

        await ctx.reply(`Название: ${beerData.name}\n${volumeData}Цена: ${beerData.ibu} $`, Markup.inlineKeyboard([
            Markup.button.url('Перейти к карточке товара', `https://jenjarus.github.io/React-Shop/catalog/${randomIndex}`)
        ]));
    } catch (err) {
        ctx.reply(`Приозошла ошибка: ${err}`);
    }
}

async function getApiBeer(i) {
    const url = `https://api.punkapi.com/v2/beers/${i}`;
    const apiResponse = await fetch(url);
    const data = await apiResponse.json();

    return data[0];
}

async function getExchangeInfo(ctx) {
    try {
        const USD = await getApiExchange('USD');
        const EUR = await getApiExchange('EUR');

        const text = `1$ = ${USD} руб.\n1€ = ${EUR} руб.`;

        await ctx.reply(text);
    } catch (err) {
        ctx.reply(`Приозошла ошибка: ${err}`);
    }
}

async function getApiExchange(currency) {
    const url = `https://api.exchangerate-api.com/v4/latest/${currency}`;
    const apiResponse = await fetch(url);
    const data = await apiResponse.json();

    return data.rates.RUB;
}


export {getPredict, getBeerInfo, getExchangeInfo};

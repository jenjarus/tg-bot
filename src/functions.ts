import fetch from "node-fetch";
import {Context, Markup} from 'telegraf';

function getPredict(ctx: Context): void {
    const answer: string[] = [
        'Да',
        'Нет',
    ];
    const randomIndex: number = Math.floor(Math.random() * answer.length);
    ctx.reply(answer[randomIndex]);
}

async function getBeerInfo(ctx: Context): Promise<void> {
    try {
        const randomIndex: number = Math.floor(Math.random() * 30);
        const beerData = await getApiBeer(randomIndex);
        const volumeData: string = beerData?.volume?.value ? `Объем: ${beerData.volume.value} л\n` : ``;
        const msg: string = `Название: ${beerData?.name}\n${volumeData}Цена: ${beerData?.ibu} $`;

        await ctx.reply(msg, Markup.inlineKeyboard([
            Markup.button.url('Перейти к карточке товара', `https://jenjarus.github.io/React-Shop/catalog/${randomIndex}`)
        ]));
    } catch (err) {
        ctx.reply(`Приозошла ошибка: ${err}`);
    }
}

async function getApiBeer(i: number) {
    const url: string = `https://punkapi.online/v3/beers/${i}`;
    const apiResponse = await fetch(url);
    const data = await apiResponse.json();

    return data;
}

async function getExchangeInfo(ctx: Context): Promise<void> {
    try {
        const USD: string = await getApiExchange('USD');
        const EUR: string = await getApiExchange('EUR');

        const text: string = `1$ = ${USD} руб.\n1€ = ${EUR} руб.`;

        await ctx.reply(text);
    } catch (err) {
        ctx.reply(`Приозошла ошибка: ${err}`);
    }
}

async function getApiExchange(currency: string): Promise<string> {
    const url: string = `https://api.exchangerate-api.com/v4/latest/${currency}`;
    const apiResponse = await fetch(url);
    const data = await apiResponse.json();

    return data.rates.RUB;
}

export {getPredict, getBeerInfo, getExchangeInfo};
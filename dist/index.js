"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const telegraf_1 = require("telegraf");
const functions_1 = require("./functions");
const bot = new telegraf_1.Telegraf(process.env.TOKEN_KEY);
var objMenu;
(function (objMenu) {
    objMenu["githubLink"] = "\uD83D\uDEE0\uFE0F \u041E\u0442\u043A\u0440\u044B\u0442\u044C Github";
    objMenu["googleLink"] = "\uD83D\uDCC4 \u041E\u0442\u043A\u0440\u044B\u0442\u044C Google";
    objMenu["beerLink"] = "\uD83C\uDF7B \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043C\u0430\u0433\u0430\u0437\u0438\u043D \u043F\u0438\u0432\u0430 (\u043D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442)";
    objMenu["beerRandomInfo"] = "\uD83C\uDF7A \u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0441\u043B\u0443\u0447\u0430\u0439\u043D\u043E\u0435 \u043F\u0438\u0432\u043E (\u043D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442)";
    objMenu["predict"] = "\uD83D\uDD2E \u041F\u0440\u0435\u0434\u0441\u043A\u0430\u0437\u0430\u043D\u0438\u0435";
    objMenu["exchange"] = "\uD83D\uDCB5 \u041A\u0443\u0440\u0441 \u0432\u0430\u043B\u044E\u0442";
})(objMenu || (objMenu = {}));
const objHears = {
    github: {
        name: 'Github',
        link: 'https://github.com/',
    },
    myGithub: {
        name: 'Моя страница Github',
        link: 'https://github.com/jenjarus',
    },
    google: {
        name: 'Google',
        link: 'https://google.com/',
    },
    beer: {
        name: 'Магазин пива (не работает - отключен api)',
        link: 'https://jenjarus.github.io/React-Shop/',
    }
};
const objCommands = {
    img: {
        command: 'img',
        description: 'Отправка случайного изображения',
    },
    exchange: {
        command: 'exchange',
        description: 'Получить текущий курс валют',
    },
    predict: {
        command: 'predict',
        description: 'Предсказание (да или нет)',
    },
    remind: {
        command: 'remind',
        description: 'Чтобы получить напоминание в 14:30 с текстом “Встреча”, отправьте сообщение /remind 14:30 Встреча',
    },
    remindday: {
        command: 'reminddata',
        description: 'Чтобы получить напоминание в 14:30 с текстом “Встреча”, отправьте сообщение /remindday 31.12.2007 14:30 Встреча',
    }
};
const arrCommandsMenu = [
    {
        command: objCommands.img.command,
        description: objCommands.img.description,
    },
    {
        command: objCommands.exchange.command,
        description: objCommands.exchange.description,
    },
    {
        command: objCommands.predict.command,
        description: objCommands.predict.description,
    },
    {
        command: objCommands.remind.command,
        description: objCommands.remind.description,
    }
];
bot.start((ctx) => {
    var _a, _b, _c, _d, _e, _f;
    const chatName = ((_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _a === void 0 ? void 0 : _a.from) === null || _b === void 0 ? void 0 : _b.first_name) ? (_d = (_c = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _c === void 0 ? void 0 : _c.from) === null || _d === void 0 ? void 0 : _d.first_name : (_f = (_e = ctx === null || ctx === void 0 ? void 0 : ctx.message) === null || _e === void 0 ? void 0 : _e.from) === null || _f === void 0 ? void 0 : _f.username;
    const startMsg = `Привет, ${chatName}! Я телеграм-бот. Я могу отправлять случайные изображения и многое другое!

Чтобы получить ответ на загаданный вопрос, напишите /${objCommands.predict.command}.

Чтобы получить случайное изображение, напишите /${objCommands.img.command}.

Чтобы создать напоминание, напишите /${objCommands.remind.command} в формате "чч:мм текст".
Например, чтобы создать напоминание на 15:30 с текстом "Позвонить маме", напишите "/${objCommands.remind.command} 15:30 Позвонить маме".

Чтобы получить текущий курс валют (доллар и евро), напишите /${objCommands.exchange.command}.
`;
    const arrMenuKeyboard = [
        [objMenu.githubLink, objMenu.googleLink],
        [objMenu.beerLink],
        [objMenu.beerRandomInfo],
        [objMenu.predict, objMenu.exchange]
    ];
    /*ctx.reply(startMsg, Markup.keyboard(arrMenuKeyboard).oneTime().resize());*/
    ctx.reply(startMsg, telegraf_1.Markup.keyboard(arrMenuKeyboard));
});
bot.help((ctx) => { ctx.reply('Это помощь.'); });
bot.telegram.setMyCommands(arrCommandsMenu);
bot.hears(objMenu.githubLink, (ctx) => {
    ctx.reply('Выберите вариант', telegraf_1.Markup.inlineKeyboard([
        [
            telegraf_1.Markup.button.url(objHears.github.name, objHears.github.link),
        ],
        [
            telegraf_1.Markup.button.url(objHears.myGithub.name, objHears.myGithub.link),
        ]
    ]));
});
bot.hears(objMenu.googleLink, (ctx) => {
    ctx.reply('Открыть Google', telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.url(objHears.google.name, objHears.google.link)
    ]));
});
bot.hears(objMenu.beerLink, (ctx) => {
    ctx.reply('Открыть магазин пива', telegraf_1.Markup.inlineKeyboard([
        telegraf_1.Markup.button.url(objHears.beer.name, objHears.beer.link)
    ]));
});
bot.hears(objMenu.beerRandomInfo, (ctx) => {
    /*getBeerInfo(ctx);*/
    ctx.reply('Извините, но не работает - отключен api');
});
bot.hears(objMenu.predict, (ctx) => {
    (0, functions_1.getPredict)(ctx);
});
bot.hears(objMenu.exchange, (ctx) => {
    (0, functions_1.getExchangeInfo)(ctx);
});
bot.command(objCommands.remind.command, (ctx) => {
    const [time, ...text] = ctx.message.text.split(`/${objCommands.remind.command} `)[1].split(' ');
    const [hours, minutes] = time.split(':');
    const now = new Date();
    const remindTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(hours), Number(minutes));
    if (remindTime < now) {
        ctx.reply('Вы указали прошедшее время. Пожалуйста, укажите будущее время.');
        return;
    }
    setTimeout(() => {
        ctx.reply(`Напоминаю: ${text.join(' ')}`);
    }, remindTime.getTime() - now.getTime());
    ctx.reply('Отлично! Я обязательно напомню :)');
});
/*bot.command('reminddata', (ctx) => {
    const [date, time, ...text] = ctx.message.text.split('/reminddata ')[1].split(' ');
    const [day, month, year] = date.split('.');
    const [hours, minutes] = time.split(':');

    const now = new Date();
    const remindTime = new Date(year, month - 1, day, hours, minutes);

    if (remindTime < now) {
        ctx.reply('Вы указали прошедшее время. Пожалуйста, укажите будущее время.');
        return;
    }

    setTimeout(() => {
        ctx.reply(`Напоминаю: ${text.join(' ')}`);
    }, remindTime - now);

    ctx.reply('Отлично! Я обязательно напомню :)');
});*/
bot.command(objCommands.img.command, (ctx) => {
    const images = [
        'https://placehold.co/200x300.png',
        'https://placehold.co/300x200.png',
        'https://placehold.co/200x200.png'
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    // ctx.replyWithPhoto(images[randomIndex], { caption: "cat photo" });
    ctx.replyWithPhoto({ url: images[randomIndex] });
});
bot.command(objCommands.predict.command, (ctx) => {
    (0, functions_1.getPredict)(ctx);
});
bot.command(objCommands.exchange.command, (ctx) => {
    (0, functions_1.getExchangeInfo)(ctx);
});
bot.launch();

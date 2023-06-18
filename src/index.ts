import 'dotenv/config';
import {Telegraf, Markup} from 'telegraf';
import {getPredict, getBeerInfo, getExchangeInfo} from './functions';
import {IArrCommandsMenu, IObjCommands, IObjHears} from './types';

const bot = new Telegraf(<string>process.env.TOKEN_KEY);

enum objMenu {
    githubLink = '🛠️ Открыть Github',
    googleLink = '📄 Открыть Google',
    beerLink = '🍻 Открыть магазин пива',
    beerRandomInfo = '🍺 Показать случайное пиво',
    predict = '🔮 Предсказание',
    exchange = '💵 Курс валют',
}
const objHears: IObjHears = {
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
        name: 'Магазин пива',
        link: 'https://jenjarus.github.io/React-Shop/',
    }
};
const objCommands: IObjCommands = {
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
const arrCommandsMenu: IArrCommandsMenu[] = [
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
    const chatName = ctx.message.from.first_name ? ctx.message.from.first_name : ctx.message.from.username;
    const startMsg: string = `Привет, ${chatName}! Я телеграм-бот. Я могу отправлять случайные изображения и многое другое!

Чтобы получить ответ на загаданный вопрос, напишите /${objCommands.predict.command}.

Чтобы получить случайное изображение, напишите /${objCommands.img.command}.

Чтобы создать напоминание, напишите /${objCommands.remind.command} в формате "чч:мм текст".
Например, чтобы создать напоминание на 15:30 с текстом "Позвонить маме", напишите "/${objCommands.remind.command} 15:30 Позвонить маме".

Чтобы получить текущий курс валют (доллар и евро), напишите /${objCommands.exchange.command}.
`;
    const arrMenuKeyboard: string[][] = [
        [objMenu.githubLink, objMenu.googleLink],
        [objMenu.beerLink],
        [objMenu.beerRandomInfo],
        [objMenu.predict, objMenu.exchange]
    ];

    /*ctx.reply(startMsg, Markup.keyboard(arrMenuKeyboard).oneTime().resize());*/
    ctx.reply(startMsg, Markup.keyboard(arrMenuKeyboard));
});

bot.help((ctx) => ctx.reply('Это помощь.'));

bot.telegram.setMyCommands(arrCommandsMenu);

bot.hears(objMenu.githubLink, (ctx) => {
    ctx.reply('Выберите вариант', Markup.inlineKeyboard([
        [
            Markup.button.url(objHears.github.name, objHears.github.link),
        ],
        [
            Markup.button.url(objHears.myGithub.name, objHears.myGithub.link),
        ]
    ]))
});

bot.hears(objMenu.googleLink, (ctx) => {
    ctx.reply('Открыть Google', Markup.inlineKeyboard([
        Markup.button.url(objHears.google.name, objHears.google.link)
    ]))
});

bot.hears(objMenu.beerLink, (ctx) => {
    ctx.reply('Открыть магазин пива', Markup.inlineKeyboard([
        Markup.button.url(objHears.beer.name, objHears.beer.link)
    ]))
});

bot.hears(objMenu.beerRandomInfo, (ctx) => {
    getBeerInfo(ctx);
});

bot.hears(objMenu.predict, (ctx) => {
    getPredict(ctx);
});

bot.hears(objMenu.exchange, (ctx) => {
    getExchangeInfo(ctx);
});

bot.command(objCommands.remind.command, (ctx) => {
    const [time, ...text]: string[] = ctx.message.text.split(`/${objCommands.remind.command} `)[1].split(' ');
    const [hours, minutes]: string[] = time.split(':');

    const now: Date = new Date();
    const remindTime: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(hours), Number(minutes));

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
    const images: string[] = [
        'https://placehold.co/200x300.png',
        'https://placehold.co/300x200.png',
        'https://placehold.co/200x200.png'
    ];
    const randomIndex:number = Math.floor(Math.random() * images.length);

    // ctx.replyWithPhoto(images[randomIndex], { caption: "cat photo" });
    ctx.replyWithPhoto({url: images[randomIndex]});
});

bot.command(objCommands.predict.command, (ctx) => {
    getPredict(ctx);
});

bot.command(objCommands.exchange.command, (ctx) => {
    getExchangeInfo(ctx);
});

bot.launch();
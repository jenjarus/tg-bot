import 'dotenv/config';
import {Telegraf, Markup} from 'telegraf';
import {getPredict, getBeerInfo, getExchangeInfo} from './functions.js';

const bot = new Telegraf(process.env.TOKEN_KEY);

bot.start((ctx) => {
    const chatName = ctx.message.from.first_name ? ctx.message.from.first_name : ctx.message.from.username;
    ctx.reply(`Привет, ${chatName}! Я телеграм-бот. Я могу отправлять случайные изображения и многое другое!

Чтобы получить ответ на загаданный вопрос, напишите /predict.

Чтобы получить случайное изображение, напишите /img.

Чтобы создать напоминание, напишите /remind в формате "чч:мм текст".
Например, чтобы создать напоминание на 15:30 с текстом "Позвонить маме", напишите "/remind 15:30 Позвонить маме".

Чтобы получить текущий курс валют (доллар и евро), напишите /exchange.
`, Markup.keyboard([
        ['📘 Открыть Github', '📃 Открыть Google'],
        ['🍺 Открыть магазин пива'],
        ['Показать пиво'],
        ['Да или Нет', '💵 Курс валют']
    ]).oneTime().resize());
});
bot.help((ctx) => ctx.reply('Это помощь.'));
bot.telegram.setMyCommands([
    {
        command: 'img',
        description: 'Отправка случайного изображения',
    },
    {
        command: 'exchange',
        description: 'Получить текущий курс валют',
    },
    {
        command: 'predict',
        description: 'Ответ на загаданный вопрос',
    },
    {
        command: 'remind',
        description: 'Чтобы получить напоминание в 14:30 с текстом “Встреча”, отправьте сообщение /remind 14:30 Встреча',
    }
]);

bot.hears('📘 Открыть Github', (ctx) => {
    ctx.reply('Выберите вариант', Markup.inlineKeyboard([
        [
            Markup.button.url('Github', 'https://github.com/'),
        ],
        [
            Markup.button.url('Моя страница Github', 'https://github.com/jenjarus'),
        ]
    ]))
});

bot.hears('🍺 Открыть магазин пива', (ctx) => {
    ctx.reply('Открыть магазин пива', Markup.inlineKeyboard([
        Markup.button.url('Магазин пива', 'https://jenjarus.github.io/React-Shop/')
    ]))
});

bot.hears('📃 Открыть Google', (ctx) => {
    ctx.reply('Открыть Google', Markup.inlineKeyboard([
        Markup.button.url('Google', 'https://google.com/')
    ]))
});

bot.hears('Да или Нет', (ctx) => {
    getPredict(ctx);
});

bot.hears('Показать пиво', (ctx) => {
    getBeerInfo(ctx);
});

bot.hears('💵 Курс валют', (ctx) => {
    getExchangeInfo(ctx);
});

// Теперь вы можете использовать команду /remind для создания напоминания.
// Например, если вы хотите получить напоминание в 14:30 с текстом “Встреча”, отправьте сообщение /remind 14:30 Встреча.

bot.command('remind', (ctx) => {
    const [time, ...text] = ctx.message.text.split('/remind ')[1].split(' ');
    const [hours, minutes] = time.split(':');

    const now = new Date();
    const remindTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    if (remindTime < now) {
        ctx.reply('Вы указали прошедшее время. Пожалуйста, укажите будущее время.');
        return;
    }

    setTimeout(() => {
        ctx.reply(`Напоминаю: ${text.join(' ')}`);
    }, remindTime - now);

    ctx.reply('Отлично! Я обязательно напомню :)');
});

// Теперь вы можете использовать команду /remindday в формате “дд.мм.гггг чч:мм текст” для создания напоминания на определенную дату и время.
// Например, чтобы создать напоминание на 15 июня 2023 года в 15:30 с текстом “Позвонить маме”, напишите “/remindday 15.06.2023 15:30 Позвонить маме”.

/*bot.command('remindday', (ctx) => {
    const [date, time, ...text] = ctx.message.text.split('/remindday ')[1].split(' ');
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

// Теперь у вас есть команда /img для отправки случайного изображения

bot.command('img', (ctx) => {
    const images = [
        'https://placehold.co/200x300.png',
        'https://placehold.co/300x200.png',
        'https://placehold.co/200x200.png'
    ];
    const randomIndex = Math.floor(Math.random() * images.length);
    // ctx.replyWithPhoto(images[randomIndex], { caption: "cat photo" });
    ctx.replyWithPhoto({url: images[randomIndex]});
});

bot.command('predict', (ctx) => {
    getPredict(ctx);
});

bot.command('exchange', (ctx) => {
    getExchangeInfo(ctx);
});

bot.launch();

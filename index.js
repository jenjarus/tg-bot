require('dotenv').config();
const {Telegraf, Markup} = require('telegraf');
const bot = new Telegraf(process.env.TOKEN_KEY);

bot.start((ctx) => {
    const chatName = ctx.message.from.first_name ? ctx.message.from.first_name : ctx.message.from.username;
    ctx.reply(`Привет, ${chatName}! Я телеграм-бот. Я могу отправлять случайные изображения и многое другое!
---
Чтобы получить случайное изображение, напишите /img.
---
Чтобы создать напоминание, напишите /remind в формате "чч:мм текст".
Например, чтобы создать напоминание на 15:30 с текстом "Позвонить маме", напишите "/remind 15:30 Позвонить маме".
---
Чтобы создать напоминание для другого числа, напишите /remindday в формате "дд.мм.гггг чч:мм текст".
Например, чтобы создать напоминание на 15 июня 2023 года в 15:30 с текстом “Позвонить маме”, напишите “/remindday 15.06.2023 15:30 Позвонить маме”.
`, Markup.keyboard([
        ['📘 Открыть Github', '📃 Открыть Google'],
        ['🏆 Открыть мою страницу Github'],
        ['🎯 Открыть VK', '🎬 Открыть Youtube']
    ]).oneTime().resize());
});
bot.help((ctx) => ctx.reply('Это помощь.'));
bot.telegram.setMyCommands([
    {
        command: 'img',
        description: 'отправка случайного изображения',
    },
    {
        command: 'remind',
        description: 'Чтобы получить напоминание в 14:30 с текстом “Встреча”, отправьте сообщение /remind 14:30 Встреча',
    },
    {
        command: 'remindday',
        description: 'чтобы создать напоминание на 15 июня 2023 года в 15:30 с текстом “Позвонить маме”, напишите “/remindday 15.06.2023 15:30 Позвонить маме”',
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

bot.hears('🏆 Открыть мою страницу Github', (ctx) => {
    ctx.reply('Открыть мою страницу Github', Markup.inlineKeyboard([
        Markup.button.url('Моя страница Github', 'https://github.com/jenjarus')
    ]))
});

bot.hears('🎯 Открыть VK', (ctx) => {
    ctx.reply('Открыть VK', Markup.inlineKeyboard([
        Markup.button.url('VK', 'https://vk.com/')
    ]))
});

bot.hears('🎬 Открыть Youtube', (ctx) => {
    ctx.reply('Открыть Youtube', Markup.inlineKeyboard([
        Markup.button.url('Youtube', 'https://youtube.com/')
    ]))
});

bot.hears('📃 Открыть Google', (ctx) => {
    ctx.reply('Открыть Google', Markup.inlineKeyboard([
        Markup.button.url('Google', 'https://google.com/')
    ]))
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

bot.command('remindday', (ctx) => {
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
});

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

/*bot.on('text', (ctx) => {
    const messageText = ctx.message.text;
    ctx.reply(`Вы написали: ${messageText}`)
});*/

bot.launch();

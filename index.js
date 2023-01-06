require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN_KEY;
const bot = new TelegramBot(token, { polling: true });

let notes = [];
const keyboard = [
    [
        {
            text: 'Хочу горы и реку',
            callback_data: 'moreKeks'
        }
    ],
    [
        {
            text: 'Хочу горы и луга',
            callback_data: 'morePes'
        }
    ]
];


bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    let img = '';

    if (query.data === 'moreKeks') {
        img = 'https://www.sunhome.ru/i/wallpapers/163/alberta-banf-kanada.orig.jpg';
    }

    if (query.data === 'morePes') {
        img = 'https://catherineasquithgallery.com/uploads/posts/2021-02/1612678074_74-p-kartinka-fon-zelenii-lug-125.jpg';
    }

    if (img) {
        bot.sendPhoto(chatId, img, { // прикрутим клаву
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
    } else {
        bot.sendMessage(chatId, 'Непонятно, давай попробуем ещё раз?', {
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
    }
});

bot.onText(/remind (.+) в (.+)/, function (msg, match) {
    const userId = msg.from.id;
    const text = match[1];
    const time = match[2];

    notes.push({ 'uid': userId, 'time': time, 'text': text });

    bot.sendMessage(userId, 'Отлично! Я обязательно напомню :)');
});

bot.onText(/start/, (query) => {
    const chatId = query.chat.id;
    const chatName = query.chat.first_name ? query.chat.first_name : query.chat.username;

    bot.sendMessage(chatId, `Привет, ${chatName}! чего хочешь?`, {
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
});

setInterval(function(){
    for (let i = 0; i < notes.length; i++) {
        const curDate = new Date().getHours() + ':' + new Date().getMinutes();
        if (notes[i]['time'] === curDate) {
            bot.sendMessage(notes[i]['uid'], 'Напоминаю, что вы должны: '+ notes[i]['text'] + ' сейчас.');
            notes.splice(i, 1);
        }
    }
}, 1000);

bot.onText(/\/echo(.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];
    bot.sendMessage(chatId,resp);
});

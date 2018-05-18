'use strict';

if (typeof global.config === "undefined")
    global.config = require('./config.js');

process.env["NTBA_FIX_319"] = 1;
const TelegramBot = require('node-telegram-bot-api');
const net = require('net');

class BOT {
    constructor(token) {
        let self = this;
        this.token = token;
        this.bot = new TelegramBot(this.token, {polling: true});
        /* true */ ////
        //this.admin_id = 263255184;

        this.stickers = {
            trade_up: 'CAADAgADcAYAAmMr4glMgB85OvVL4QI',
            trade_down: 'CAADAgADcQYAAmMr4gny88MV-lGn-QI',
        }

        // Написать мне ... (/echo Hello World! - пришлет сообщение с этим приветствием.)
        this.bot.onText(/echo (.+)/, function (msg, match) {
            let fromId = msg.from.id;
            let resp = match[1] + ':' + fromId;
            self.bot.sendMessage(fromId, resp);
        });

        this.bot.onText(/\/love/, function onLoveText(msg) {
            const opts = {
                reply_to_message_id: msg.message_id,
                reply_markup: JSON.stringify({
                    keyboard: [
                        ['Yes, you are the bot of my life ❤'],
                        ['No, sorry there is another one...']
                    ]
                })
            };
            self.bot.sendMessage(msg.chat.id, 'Do you love me?', opts);
        });

        this.bot.onText(/\/demo/, function () {
            self.send_text('<b>bold</b>, <strong>bold</strong>' + "\n" +
                '<i>italic</i>, <em>italic</em>' + "\n" +
                '<a href="http://www.example.com/">inline URL</a>' + "\n" +
                '<a href="tg://user?id=263255184">inline mention of a user</a>' + "\n" +
                '<code>inline fixed-width code</code>' + "\n" +
                '<pre>pre-formatted fixed-width code block</pre>');
        });

        /*this.bot.onText(/(.+)/, function (msg, match) {
            var fromId = msg.from.id;
            var resp = match[1] + ':' + fromId;
            self.bot.sendMessage(fromId, JSON.stringify(msg));
        });*/

        this.bot.on('polling_error', function (error) {
            self.close();
            console.log(error);
            //self.close();
        });

        this.bot.on('message', (msg) => {
            const chatId = msg.chat.id;
            
            /*if (chatId == self.admin_id) {
                // send a message to the chat acknowledging receipt of their message
                self.bot.sendMessage(chatId, JSON.stringify(msg));
            }*/
        });

    }

    send_text(user_id, text) {
        return this.bot.sendMessage(user_id, text, {parse_mode: 'html'});
    }

    send_sticker(user_id, id) {
        return this.bot.sendSticker(user_id, id);
    }

    close(callback) {
        this.bot.closeWebHook();
        this.bot.stopPolling({
            cancel: true,
            reason: 'Polling stop',
        }).then(callback);
    }
}

for (let key in global.config.telegram)
{
    global.config.telegram[key].bot = new BOT(global.config.telegram[key].token);
    console.log('tg run!');
}

//module.exports = BOT;
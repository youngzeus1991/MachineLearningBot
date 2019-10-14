const Token = 'BoToken';
const TelegramBot = require('node-telegram-bot-api');
exports.bot = new TelegramBot(Token, {polling: true});
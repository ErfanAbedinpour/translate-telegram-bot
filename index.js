const TelegramBot = require("node-telegram-bot-api");
const actions = require("./actions/actions");
require("dotenv").config();

const botToken = process.env.BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });

bot.onText(/\/start/, actions.startActions(bot));
bot.on("callback_query", actions.callbackQueryActions(bot));

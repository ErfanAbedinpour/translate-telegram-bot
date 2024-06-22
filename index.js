const TelegramBot = require("node-telegram-bot-api");
const actions = require("./actions/actions");
const { SocksProxyAgent } = require('socks-proxy-agent');
require("dotenv").config();

const agnet = new SocksProxyAgent('socks://localhost:2080')

const botToken = process.env.BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true, request: { agent: agnet } });


bot.onText(/\/start/, actions.startActions(bot));
bot.on("callback_query", actions.callbackQueryActions(bot));
bot.on('polling_error', function(err) {
  throw err.message
})

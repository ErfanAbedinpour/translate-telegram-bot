'use strict'

const TelegramBot = require("node-telegram-bot-api");
const actions = require("./actions/actions");
const { SocksProxyAgent } = require('socks-proxy-agent');
const mongoose = require('mongoose');
require("dotenv").config();

const agnet = new SocksProxyAgent('socks://localhost:2080')
const botToken = process.env.BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true, request: { agent: agnet } });

(async function() {
  await connectDB(process.env["MONGO_URL"])
  console.log('DB is connected')
})();

bot.onText(/\/start/, actions.startActions(bot));
bot.on("callback_query", actions.callbackQueryActions(bot));

bot.on('polling_error', function(err) {
  throw err.message
})

async function connectDB(url) {
  try {
    await mongoose.connect(url)
  } catch (err) {
    throw err
  }
}

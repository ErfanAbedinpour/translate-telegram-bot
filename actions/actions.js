const component = require("../components/component");
const redis = require("../saveActions/saveActions");
const { messages } = require("../messages/messages");
const service = require("../service/translate");


//start actions for bot
exports.startActions = function(bot) {

  return function(msg, match) {
    bot.removeAllListeners('message')
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      messages.welcome + "\n" + messages.selectEngine,
      component.menuInlineKeyboard,
    );
  };
};

//query selector actins
exports.callbackQueryActions = function(bot) {
  bot.removeAllListeners('message')
  return async function(query) {
    //get user command
    const cmd = query.data;
    //get user chatid
    const chatId = query.message.chat.id;
    //get message_id
    const message_id = query.message.message_id;
    //available engines
    const engines = ["google", "microsoft", "faraazin", "targoman"];
    if (engines.includes(cmd)) {
      if (cmd == "targoman") {
        return bot.sendMessage(chatId, "ترگومان فعلان در دسترس نیست");
      }
      engineActions(cmd, chatId, message_id, bot);
    } else {
      bot.sendMessage(chatId, messages.wrongEngineSelect);
    }
  };
};

// user after select engine run this functions save user engine to redis and send dest lang
async function engineActions(cmd, chatId, message_id, bot) {
  bot.removeAllListeners('message')
  await redis.addDataToRedis(chatId.toString(), { engine: cmd });
  let msg = `موتور ${cmd} با موفقیت انتخاب شد\n`;
  if (cmd == "faraazin" || cmd == "targoman") {
    msg += "\n فارسی به انگلیسی (fa2en) \n و انگلیسی به فارسی (en2fa)";
  } else {
    msg += ` ${messages.sendDestLang}`;
  }
  editMessage(msg, chatId, message_id, bot);
  bot.on('message', getLang(bot, chatId));
}

//edit message function
function editMessage(msg, chatId, message_id, bot) {
  bot.editMessageText(msg, {
    chat_id: chatId,
    message_id,
    reply_force: true,
  });
}

//get destenition lang as user
function getLang(bot, chatId) {
  return async function(msg) {
    //get messages
    const message = msg.text;
    //save user engine to redis
    const engine = await redis.getDataFromRedis(chatId.toString(), "engine");
    //valid dest lang to faraaznin and targoman engine 
    const validPersianLangEngine = { faraazin: ['fa_en', 'en_fa'], targoman: ['fa2en', 'en2fa'] }
    // logic
    switch (engine) {
      case 'faraazin':
      case 'targoman':
        if (validPersianLangEngine[engine].includes(message)) {
          await redis.addDataToRedis(chatId.toString(), { dest: lang });
          bot.sendMessage(chatId, `موتور:${engine}\nمقصد:${message} `)
          bot.removeAllListeners('message');
          break
        } else {
          bot.sendMessage(chatId, 'زبان انتخابی مقصد شما نا معتبر است برای \n targoman:fa2en یا en2fa \n faraazin:en_fa یا fa_en')
          break
        }
      case 'microsoft':
      case "google":
        const normalizeLang = service.normalizeDest(message)
        if (!normalizeLang) {
          bot.sendMessage(chatId, `${message} وجود ندارد `)
          break
        } else {
          await redis.addDataToRedis(chatId.toString(), { dest: normalizeLang });
          bot.sendMessage(chatId, `موفقیت ثبت شد 
            موتور:${engine}
            مقصد:${normalizeLang}`)
          bot.removeAllListeners('message');
          break
        }
      default:
        bot.sendMessage(chatId, `زبان نامعتبر است`)
        break
    }
  };
}

function textToTranslate() { }


const commponents = require("../commponents/commponents");
const redis = require("../saveActions/saveActions");
const { messages } = require("../messages/messages");
const service = require("../service/translate");

//start actions for bot
exports.startActions = function(bot) {
  return function(msg, match) {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      messages.welcome + "\n" + messages.selectEngine,
      commponents.menueInlineKeyboard,
    );
  };
};

//query selector actins
exports.callbackQueryActions = function(bot) {
  return async function(query) {
    //get user command
    const cmd = query.data;
    //get user chatid
    const chatId = query.message.chat.id;
    //get message_id
    const message_id = query.message.message_id;
    //availible engines
    const engines = ["google", "micorsoft", "faraazin", "targoman"];
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
  await redis.addDataToRedis(chatId.toString(), { engine: cmd });
  let msg = `موتور ${cmd} با موفقیت انتخاب شد\n`;
  if (cmd == "faraazin" || cmd == "targoman") {
    msg += "\n فارسی به انگلیسی (fa2en) \n و انگلیسی به فارسی (en2fa)";
  } else {
    msg += ` ${messages.sendDestLang}`;
  }
  editMessage(msg, chatId, message_id, bot);
  bot.onReplyToMessage(chatId, message_id, getLang(bot, chatId));
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
    const message = msg.text;
    const engine = await redis.getDataFromRedis(chatId.toString(), "engine");
    const langs = { faraazin: ['en2_fa', 'fa_en'], targoman: ['fa2en', 'en2fa'] }
    const
    if (engine == "targoman" || engine == "faraazin") {
      if (message != "en2fa" || message != "fa2en") {
        return bot.sendMessage(
          chatId,
          `موتور شما ${engine} است و باید \n en2fa یا fa2en استفاده کنید`,
        );
      }
    } else {
      const lang = service.normalizeDest(message);
      if (!lang) {
        return bot.sendMessage(chatId, `زبان وارد شده معتبر نیست`);
      } else {
        await redis.addDataToRedis(chatId.toString(), { dest: lang });
        bot.sendMessage(
          chatId,
          `زبان مورد نظر با موفقیت انتخاب شد !!لطفا متن خود برای ترجمه را وارد کنید 
زبان مورد نظر${lang}`,
        );
      }
    }
    bot.on("message", getTextToTranslat(bot));
  };
}

const getTextToTranslat = function(bot) {
  return async function(msg, _) {
    const userInformations = await redis.getDataFromRedis(
      msg.chat.id.toString(),
    );
    console.log(userInformations);
    bot.sendMessage(msg.chat.id, `yout text is ${msg}`);
  };
};

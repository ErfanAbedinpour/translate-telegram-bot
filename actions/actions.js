const commponents = require("../commponents/commponents");
const operatorToRedis = require("../saveActions/saveActions");
const { messages } = require("../messages/messages");

//start actions for bot
exports.startActions = function (bot) {
  return function (msg, match) {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      messages.welcome + "\n" + messages.selectEngine,
      commponents.menueInlineKeyboard,
    );
  };
};

//query selector actins
exports.callbackQueryActions = function (bot) {
  return async function (query) {
    const cmd = query.data;
    const chatId = query.message.chat.id;
    const message_id = query.message.message_id;
    const engines = ["google", "microsoft", "faraazin", "targoman"];
    if (engines.includes(cmd)) {
      if (cmd == "targoman") {
        return bot.sendMessage(chatId, "targoman not avalibale now");
      }
      processActions(cmd, chatId, message_id, bot);
    }
  };
};

// user after select engine run this functions save user engine to redis and send dest lang
async function engineActions(cmd, chatId, message_id, bot) {
  await operatorToRedis.addDataToRedis(chatId.toString(), { engine: cmd });
  editMessage(
    `موتور ${cmd} با موفقیت انتخاب شد\n ${messages.sendDestLang}`,
    chatId,
    message_id,
    bot,
  );
}

//edit message function
function editMessage(msg, chatId, message_id, bot) {
  bot.editMessageText(msg, {
    chat_id: chatId,
    message_id,
  });
}

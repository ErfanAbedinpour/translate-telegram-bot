const commponents = require("../commponents/commponents");
const operatorToRedis = require("../saveActions/saveActions");

//start actions for bot
exports.startActions = function (bot) {
  return function (msg, match) {
    const chatId = msg.chat.id;
    bot.sendMessage(
      chatId,
      "به روبات ترجمه خوش امدید",
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
    if (cmd == "google") {
      //code for google selecto
      await operatorToRedis.addDataToRedis(chatId.toString(), { engine: cmd });
      const message = "<h1>this is a header</h1><hr><p>this is paragraph</p>";
      return bot.editMessageText(message, {
        chat_id: chatId,
        message_id,
      });
    } else if (cmd == "microsoft") {
      //code for microsoft
    } else if (cmd == "faraazin") {
      //code for faraazni
    } else if (cmd == "targoman") {
      //code for targoman
      return bot.sendMessage(chatId, "این گزینه فعلان در دسترس نیست");
    }
  };
};

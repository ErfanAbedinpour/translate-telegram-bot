exports.menuInlineKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: " 🇺🇸ترجمه با گوگل", callback_data: "google" },
        {
          text: " 🇺🇸ترجمه با مایکروسافت",
          callback_data: "microsoft",
        },
      ],
      [
        { text: "ترجمه با فرازین 🇮🇷", callback_data: "faraazin" },
        {
          text: "ترجمه با ترگمان 🇮🇷",
          callback_data: "targoman",
        },
      ],
    ],
  },
};

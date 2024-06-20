require("dotenv").config();
const { codes } = require("iso-language-codes");

/**
 * @param {String} text to translate
 * @param {String} dest_lang to translate to this
 */

const microsoft = async function (dest_lang, text) {
  try {
    //fetch to api and get result
    const resp = await fetch(
      `https://one-api.ir/translate/?token=${process.env.TOKEN}&action=microsoft&lang=${dest_lang}&q=${text}`,
      {
        method: "GET",
      },
    );
    const data = await resp.json();
    return data?.result.trim();
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * @param {String} text for translate
 * @param{Stiring} dest_lang to translate text
 */
//googel traslator
const google = async function (dest_lang, text) {
  try {
    //fetch to api and get result
    const resp = await fetch(
      `https://one-api.ir/translate/?token=${process.env.TOKEN}&action=google&lang=${dest_lang}&q=${text}`,
      {
        method: "GET",
      },
    );
    const data = await resp.json();
    return data?.result.trim();
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * @param{String} dest_lang
 * @param{String} text
 */
//faraazin tranlsator
const targoman = async function (dest_lang, text) {
  try {
    const resp = await fetch(
      `https://one-api.ir/translate/?token=${process.env.TOKEN}&action=targoman&lang=${dest_lang}&q=${text}`,
      { method: "GET" },
    );
    const data = await resp.json();
    return data?.result;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * @param{String} dest_lang
 * @param{String} text
 */
//faraazin tranlsator
const faraazin = async function (dest_lang, text) {
  try {
    const resp = await fetch(
      `https://one-api.ir/translate/?token=${process.env.TOKEN}&action=faraazin&lang=${dest_lang}&q=${text}`,
      { method: "GET" },
    );
    const data = await resp.json();
    return data.result.base[0][1].trim();
  } catch (error) {
    throw new Error(error);
  }
};

// normalize text of dest like english => en, en => en
function normalizeDest(dest) {
  dest = dest.toLowerCase();
  for (let i = 0; i < codes.length; i++) {
    if (
      codes[i].name.toLowerCase() == dest.toLowerCase() ||
      codes[i].iso639_1.toLowerCase() == dest ||
      codes[i].nativeName.toLowerCase() == dest.toLowerCase()
    ) {
      return codes[i].iso639_1;
    }
  }
  return null;
}

module.exports = {
  google,
  microsoft,
  faraazin,
  targoman,
  normalizeDest,
};

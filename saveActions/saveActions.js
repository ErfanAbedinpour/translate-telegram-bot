const { createClient } = require("redis");

//connect to redis
const client = createClient();
client.connect().then((_) => console.log("connected to redis :))"));

//catch error when error
client.on("error", (err) => {
  throw new Error(err.message);
});

//add data to redis and update them if key is exsist if not created new item
async function addDataToRedis(key, value) {
  try {
    await client.hSet(key, value);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

//get data with key
async function getDataFromRedis(key) {
  try {
    const data = await client.hGetAll(key);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

//delete operator for key
async function deleteDataFromRedis(key) {
  try {
    const datas = await getDataFromRedis(key);
    await client.hDel(key, Object.keys(datas));
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
}

module.exports = {
  addDataToRedis,
  deleteDataFromRedis,
  getDataFromRedis,
};

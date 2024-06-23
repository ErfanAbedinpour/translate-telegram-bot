const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  chatId: { type: String, required: [true, 'chat id is required'] },
  userName: { type: String, required: [true, 'user name is required'] },
}, {
  timestamps: true
})

const model = mongoose.model('users', schema)
module.exports = model

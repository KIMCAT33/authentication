// MongoDB 연결
const mongoose = require('mongoose');
const mongoDB = 'mongodb+srv://venduster:qpsej0424!@cluster0-on6pa.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

module.exports = mongoose;
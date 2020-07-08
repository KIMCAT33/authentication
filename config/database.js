// MongoDB 연결
const mongoose = require('mongoose');
const mongoDB = 'mongodb://venduster:qpsej0424!@cluster0-shard-00-00-on6pa.mongodb.net:27017,cluster0-shard-00-01-on6pa.mongodb.net:27017,cluster0-shard-00-02-on6pa.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;

module.exports = mongoose;
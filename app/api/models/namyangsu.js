const mongoose = require('mongoose');

// 스키마 정의
const Schema = mongoose.Schema;

const Namyangsu = new Schema({
    phone: {
        type: String,
        trim: true,
        required: true,
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    birth: {
        type: String,
        trim: true,
        required: true,
    },
    count: {
        type:Number,
        trim: true,
        default: 0,
    }
});

module.exports = mongoose.model('Namyangsu', Namyangsu)
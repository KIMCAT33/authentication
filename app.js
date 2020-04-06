const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const venduster = require('./routes/venduster');
const mongoose = require('./config/database'); // database configuration
var jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.set('secretKey', 'nodeRestApi'); // JWT 비밀 토큰

// mondoDB 연결
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));




app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.get('/', function (req, res) {
    res.json({ "info": "Build REST API with node.js" });
});

// public route
app.use('/users', users);

// private route
app.use('/venduster', verifyToken, venduster);


app.get('/favicon.ico', function (req, res) {
    res.sendStatus(204);
});


function verifyToken(req, res, next) {
    console.log(req);
    try {
        req.decoded = jwt.verify(req.headers.authorization, req.app.get('secretKey'))
        return next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(419).json({
                resultCode: 419,
                meesage: "토큰 만료"
            });
        }

        return res.status(401).json({
            resultCode: 401,
            message: "토큰이 유효하지 않습니다."
        })
    }

}

// 404 에러 처리
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// 에러 처리
app.use(function (err, req, res, next) {
    console.log(err);
    if (err.status === 404)
        res.status(404).json({ message: "Not found" });
    else
        res.status(500).json({ message: "404가 아닌 에러가 발생하였습니다." });
});


app.listen(port, function () { console.log(`Node server listening on port ${port}`); });

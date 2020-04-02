const express = require('express'); 
const logger = require('morgan');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const mongoose = require('./config/database'); // database configuration
var jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

app.set('secretKey', 'nodeRestApi'); // JWT 비밀 토큰

// mondoDB 연결
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));



app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const port = process.env.PORT || 3000;

app.get('/', function(req, res){
 res.json({"info" : "Build REST API with node.js"});
});

// public route
app.use('/users', users);

// private route
app.use('/venduster', validateUser);


app.get('/favicon.ico', function(req, res){
    res.sendStatus(204);
});

function validateUser(req, res, next){
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded){
        if(err){
            res.json({status:"error", message: err.message, data:null});
        }else{
            // add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });
}

// 404 에러 처리
app.use(function(req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// 에러 처리
app.use(function(err, req, res, next){
    console.log(err);
    if(err.status === 404)
        res.status(404).json({message: "Not found"});
    else
        res.status(500).json({message: "404가 아닌 에러가 발생하였습니다."});
});


app.listen(port, function() { console.log(`Node server listening on port ${port}`);});

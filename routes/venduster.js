const AWS = require('aws-sdk');
const express = require('express');
const uuid = require('uuid');

const IS_OFFLINE = process.env.NODE_ENV !== 'production';
const USERS_TABLE = 'namyang_users';

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'ap-northeast-2',
        endpoint: 'http://127.0.0.1:8080',
    }) :
    new AWS.DynamoDB.DocumentClient();

const router = express.Router();

// 전체 조회
router.get('/users', (req, res) => {
    const params = {
        TableName: USERS_TABLE

    };
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            res.json({ error: '사용자 정보를 불러오는 데 실패하였습니다.' });
        }
        res.json(result.Items);
    });
});

// 휴대폰으로 조회
router.get(`/users/:phone`, (req, res) => {
    const phone = req.params.phone;
    const params = {
        TableName: USERS_TABLE,
        KeyConditionExpression: "phone = :phone",
        ExpressionAttributeValues: {
            ":phone": phone
        }
    };

    dynamoDb.query(params, function (error, result) {

        if (error) {
            res.json({ state: "false", error: '사용자를 불러오는데 실패하였습니다.' });
        } else if (result.Items[0] !== undefined) {
            res.json({ state: "success", info: result.Items[0] });
        } else {
            res.json({ state: "false", error: ` 전화번호 ${phone}의 사용자는 등록되지 않았습니다.` });
        }
    });
});

// 수령자 추가 
router.post('/users', (req, res) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const birth = req.body.birth;

    const params = {
        TableName: USERS_TABLE,
        KeyConditionExpression: "phone = :phone",
        ExpressionAttributeValues: {
            ":phone": phone
        }
    };

    dynamoDb.query(params, function (error, result) {

        if (error) {
            res.json({ state: "false", error: '데이터베이스 오류가 발생하였습니다.' });
        } else if (result.Items[0] !== undefined) {
            res.json({ state: "false", info: "이미 등록된 사용자입니다." });
        } else {
            const params = {
                TableName: USERS_TABLE,
                Item: {
                    "phone": phone,
                    "name": name,
                    "birth": birth,
                    "count": 0
                }
            };

            dynamoDb.put(params, (error, data) => {
                if (error) {
                    res.json({ error: '사용자를 추가할 수 없습니다.' });
                }
                else { res.json({ state: "success", info: "사용자 등록이 완료되었습니다." }) }
            });
        }
    });


});


// 수령자 확인 
router.patch('/users', (req, res) => {
    const phone = req.body.phone;
    const name = req.body.name;
    const birth = req.body.birth;
    
    const params = {
        TableName : USERS_TABLE,
        KeyConditionExpression: "phone = :phone",
        ExpressionAttributeValues: {
            ":phone": phone
        }
    };

    dynamoDb.query(params, function (error, result){
        if(result.Items[0]==undefined){
            res.json({ state: "false", error: "등록되지 않은 사용자입니다."});
        } else{
            // 등록된 사람이면, count 개수를 1개 늘림
            const params2 = {
                TableName : USERS_TABLE,
                Key: {
                    "phone":phone,
                    "name":name
                },
                UpdateExpression: 'set #count = #count + :val',
                ExpressionAttributeNames: { '#count': 'count'},
                ExpressionAttributeValues: { ':val': 1 },
                ReturnValues: "ALL_NEW"
            }
            
            dynamoDb.update(params2, (error, result) => {
                if(error) {
                    res.json({state: "false", error: "데이터베이스 업데이트 중 에러가 발생하였습니다."});
                }
                else{
                    res.json({state: "success", info: "마스크 지급이 완료되었습니다."});
                }
            });
        }
    })
});

module.exports = router;
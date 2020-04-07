const userModel = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
module.exports = {
    create: function (req, res, next) {

        userModel.create({ name: req.body.name, email: req.body.email, password: req.body.password }, function (err, result) {
            if (err)
                next(err);
            else
                res.json({ status: "success", message: "유저가 등록되었습니다.", data: null });

        });
    },
    authenticate: function (req, res, next) {
        userModel.findOne({ email: req.body.email }, function (err, userInfo) {
            if (userInfo == undefined) {
                res.json({ status: "fail", message: "등록되지 않은 어드민 계정입니다." });
            } else {
                if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                    const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '1h' });
                    res.json({ status: "success", message: "토큰 발행, 로그인 성공", data: { user: userInfo, token: token } });
                } else {
                    res.json({ status: "error", message: "옳바르지 않은 아이디 및 비밀번호입니다.", data: null });
                }
            }

        });
    },
}
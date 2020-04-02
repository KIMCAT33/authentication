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
            if (err) {
                next(err);
            } else {
                if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                    const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '1h' });
                    res.json({ status: "success", message: "사용자를 찾았습니다.", data: { user: userInfo, token: token } });
                } else {
                    res.json({ status: "error", message: "옳바르지 않은 아이디 및 비밀번호입니다.", data: null });
                }
            }
        });
    },
}
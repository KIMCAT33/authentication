const namyangsuModel = require('../models/namyangsu');



module.exports = {

   
    getAll: function (req, res, next) {
        let usersList = [];

        namyangsuModel.find({}, function(err, users){
            if(err){
                next(err);
            }else{
                for(let user of users){
                    usersList.push({phone: user.phone, name: user.name, birth: user.birth, count: user.count, randomNumber: user.randomNumber, date: user.date});
                }
                res.json({status: "success", message: "사용자 목록을 출력하였습니다.", data: {users: usersList}});
            }
        });

        
    },

    getById: function (req, res, next) {
        const query = {phone: req.body.phone};
        namyangsuModel.findOne(query, function(err, userInfo){
            if(err){
                next(err);
            }else{
                res.json({status:"Success", message: "사용자를 찾았습니다.", data: {user: userInfo}});
            }
        }); 
    },
    

    updateById: function (req, res, next) {
        const query = {phone: req.post.phone};
        namyangsuModel.findOne(query, function(err, userInfo){
            if(err){
                next(err);
            }else{
                var updatedCount = userInfo.count + 1;
                namyangsuModel.findOneAndUpdate(query, {count: updatedCount }, function(err, userInfo){
                    if(err){
                        next(err);
                    }else{
                        res.json({status:"Success", message: "마스크 보급을 완료하였습니다.", data:null});
                    }
                });
            }
        })
   
    },   

  create: function(req, res, next){
    namyangsuModel.create({phone: req.body.phone, name: req.body.name, birth: req.body.birth}, function(err, result){
        if(err){
            next(err);
        }
        else{
            res.json({status: "success", message: "사용자가 등록되었습니다.", data:null});
        }
    });
  },
}
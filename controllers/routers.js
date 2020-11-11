const User = require('../models/User')
const formidable = require('formidable')
const bcrypt = require('bcrypt')

/**
 *检查用户名是否被占用
 */
exports.checkExist = (req,res) => {
    const form = formidable({multiple: true})
    form.parse(req, (err, fields) => {
        let email = fields.email
        User.find({email: email}, (err, users) => {
            if(err){
                return res.send('-2') //server error
            }
            if(users.length !==0){
                return res.send('1') //user exists
            }
            return res.send('0') //user not exist, can register
        })
    })
}

/***
 * 注册
 */
exports.doRegisterUser = (req,res) => {
    let form = formidable({multiple: true})
    form.parse(req,(err, fields) => {
        if(err){
            return res.send('-2') //server error
        }

        //加密密码
        const saltRounds = 10;

        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(fields.password, salt, function(err, hash) {
                //hash就是加密过后的密码，可以存储到数据库中了
                let user = new User({
                    email: fields.email,
                    password: hash
                })
                user.save().then(()=>{
                    //注册成功，下发session
                    req.session.login=true
                    req.session.email = fields.email
                    req.session.nickname = 'NoOne'
                    return res.send('1')
                })
            });
        })

    })
}

/**
 * 检查是否已经登陆
 */
exports.checkLogin = (req,res) => {
    if(req.session.login){
        return res.send({
            login: true,
            email: req.session.email,
            nickname: req.session.nickname
        })
    }
    return  res.send({
        login: false,
        email: req.session.email
    })
}

/**
 * 用户登陆
 */
exports.login = (req,res) =>{
    let form = formidable({multiple: true})
    form.parse(req, (err, fields)=>{
        if(err){
            return res.send('-2') //server error
        }

        //检查用户名是否存在
        User.find({email: fields.email}, (err, users) =>{
            if(err){
                return res.send('-2') //server error
            }

            if(users.length===0){
                console.log(users.length)
                return res.send('0') //no such user
            }

            //通过前两项，检查密码是否相同
            //bcrypt比对密码
            //如果修改过密码，则比对bcrypt密文，使用bcrypt.compare()方法
            bcrypt.compare(fields.password, users[0].password, (err, isMatch) => {
                if(err){
                    return res.send('-2') //server error
                }
                //isMatch是否匹配成功
                if(isMatch){
                    //下发session
                    req.session.login=true
                    req.session.email =fields.email
                    req.session.nickname = users[0].nickname
                    return res.send('1')//login successfully
                }
                return res.send('-1') //password incorrect
            })
        })
    })
}
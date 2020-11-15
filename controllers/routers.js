const User = require('../models/User')
const formidable = require('formidable')
const bcrypt = require('bcrypt')
const gm = require('gm')
const Says = require('../models/Says')

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
                    // req.session.avatar=''
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
            nickname: req.session.nickname,
            avatar: req.session.avatar || '/images/default_avatar.jpg'
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
                    req.session.avatar = users[0].avatar
                    return res.send('1')//login successfully
                }
                return res.send('-1') //password incorrect
            })
        })
    })
}

/**
 * 显示当前登陆用户的资料页面
 */
exports.profile = (req,res) =>{
    // if(req.session.login){
        //如果用于登陆了，显示更改资料页
        let email = req.session.email
        // let email = 'lucy@lucy.com'

        //通过email检索数据库
        User.find({email:email},(err,users) =>{
            if(err){
                return res.send('-2') //server error
            }
            if(users.length===0){
                return res.send('0') //no such user
            }
            //通过上面两步，返回用户数据
            return res.send({
                email: users[0].email,
                nickname: users[0].nickname,
                signature: users[0].signature,
                avatar: users[0].avatar
            })
        })
    // }else{
    //     //用户没登陆，跳转到登陆页面
    //     return res.send('-1 Please login first') //还没有登陆，要先登陆
    // }
}

/**
 * 上传文件
 */
exports.upload = (req,res)=>{
    //设置上传到哪个文件夹下，并保留扩展名
    const form = formidable({ multiples: true, uploadDir: './www/uploads' });
    //这样就上传成功了
    form.parse(req, (err, fields, files) => {
        //先检查图片尺寸的框高是否至少100
        //使用gm来检查
        gm(files.file.path).size((err,size) => {
            if(err){
                return res.send('-2')//server err
            }
            if(size.width<100 || size.height<100){
                //图片大小不符合标准
                return res.send('-1') //size not proper
            }
            return res.send(files)
        })
    })
}

/**
 * \切图片
 */
exports.cut = (req,res) => {
    let w = req.query.a
    let h = req.query.h
    let x = req.query.x
    let y = req.query.y
    let imgUrl = req.query.url

    gm('./'+imgUrl).crop(w,h,x,y).resize(100,100,'!').write('./'+imgUrl, ()=>{
        return res.send('1') //cut done
    })
}

/**
 * 更新用户资料
 */
exports.updateProfile = (req,res) => {
    const form = formidable({multiplies: true})
    form.parse(req,(err,fields)=>{
        User.find({email:req.session.email}, (err, users) => {
            if(err){
                return res.send('-2') //server error
            }
            users[0].nickname=fields.params.nickname
            users[0].avatar = fields.params.avatar
            users[0].signature = fields.params.signature
            req.session.nickname = fields.params.nickname
            req.session.avatar = fields.params.avatar

            users[0].save().then(()=>{
                return res.send('1')
            })
        })
    })
}

/**
 * 发表说说
 * */
exports.releaseSays = (req,res) => {
    const form = formidable({multiples: true})
    form.parse(req,(err, fields) => {
        let says = new Says({
            email:req.session.email,
            content:fields.params.content,
            date:new Date()
        })

        says.save().then(()=>{
            return res.send('1')
        })
    })
}
/**
 * 得到所有说说
 * */
exports.getSays = (req,res) => {
    let R = []

    Says.find({}, (err, sayses) => {
        sayses.forEach((item) => {
            User.find({email:item.email}, (err, users) => {
                if(err){
                    return res.send('-2') //server error
                }
                if(!users[0]){
                    return
                }

                let user = users[0]
                //获取到的每一项，mongoDB的Schema不允许向这个对象中添加新属性，因此需要创建一个新对象
                // item.nickname = user.nickname
                // item.avatar = user.avatar
                // item.avatar = user.signature
                let obj = {
                    email: item.email,
                    date: item.date,
                    nickname : user.nickname,
                    avatar : user.avatar,
                    signature : user.signature,
                    content: item.content
                }
                R.push(obj)

                //当R数组长度和sayses长度一样时，说明所有用户检索完毕了
                if(R.length === sayses.length){
                    return res.send(R)
                }
            })
        })
    })
}
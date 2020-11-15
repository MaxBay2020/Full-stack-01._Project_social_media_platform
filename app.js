const express = require('express')
const app = express()
const mongoose = require('mongoose')
const mongodbUrl = require('./config/mongoDBUrl')
const session = require('express-session')
const routers = require('./controllers/routers')

mongoose.connect(mongodbUrl.mongodburl, {useNewUrlParser: true, useUnifiedTopology: true})

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'max',
    cookie: {maxAge: 1000*60*60}, //1 hour
    resave: false,
    saveUninitialized: true
}))

app.use('/', express.static(__dirname+'/www'))

/***
 * routers
 */
app.post    ('/checkExist'      , routers.checkExist)
app.post    ('/user'            , routers.doRegisterUser)
app.get     ('/checkLogin'      , routers.checkLogin)
app.post    ('/login'           , routers.login)
app.get     ('/profile'         , routers.profile)
app.post    ('/upload'          , routers.upload)
app.get     ('/cut'             , routers.cut)
app.post    ('/updateProfile'          , routers.updateProfile)
app.post    ('/says'            , routers.releaseSays)
app.get     ('/says'            , routers.getSays)

app.use((req,res) => {
    return res.send('Sorry, page lost')
})

app.listen(3000, () => {
    console.log('server running...')
})
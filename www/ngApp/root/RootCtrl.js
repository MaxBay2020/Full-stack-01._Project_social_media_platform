define(function (require) {
    var app = require('app');
    require('../services/loginService')

    app.controller('RootCtrl', ['loginService', function (loginService) {
        //控制器一被实例化，就英国立即想服务器查询登陆状态
        loginService.checkLogin()

        this.isLogin = () =>{
            return loginService.getLogin()
        }

        this.getNickname = ()=>{
            return loginService.getNickname()
        }

        this.getEmail = ()=>{
            return loginService.getEmail()
        }

        this.getAvatar = () => {
            return loginService.getAvatar()
        }

    }]);

});
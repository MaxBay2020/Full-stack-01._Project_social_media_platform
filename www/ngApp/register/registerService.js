define(function() {
    let app = require('app')
    app.factory('registerService', ['$http',  function($http) {
        //检查email是否被占用
        function checkEmailExist(email, callback){
            $http.post('/checkExist', {
                email: email
            }).then(callback)
        }

        //执行注册
        function doRegister(email, password,callback){
            $http.post('/user', {
                email: email,
                password:password
            }).then(callback)
        }

        //暴露
        return {
            checkEmailExist: checkEmailExist,
            doRegister: doRegister
        }
    }])
})
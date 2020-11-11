define(function(){
    let app = require('app')

    app.factory('loginService', ['$http', ($http)=>{
        let isLogin = false
        let nickname = ''
        let email = ''
        return{
            checkLogin: () => {
                $http.get('/checkLogin').then((data) => {
                    isLogin = data.data.login
                    nickname=data.data.nickname
                    email=data.data.email
                })
            },
            getLogin: ()=>{
                return isLogin
            },
            getNickname: () =>{
                return nickname
            },
            getEmail: ()=>{
                return email
            }
        }
    }])
})
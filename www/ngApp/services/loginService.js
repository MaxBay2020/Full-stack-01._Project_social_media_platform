define(function(){
    let app = require('app')

    app.factory('loginService', ['$http', ($http)=>{
        let isLogin = false
        let nickname = ''
        let email = ''
        let avatar = ''
        return{
            checkLogin: () => {
                $http.get('/checkLogin').then((data) => {
                    console.log(data)
                    isLogin = data.data.login
                    nickname=data.data.nickname
                    email=data.data.email
                    avatar = data.data.avatar
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
            },
            getAvatar: ()=>{
                return avatar
            }
        }
    }])
})
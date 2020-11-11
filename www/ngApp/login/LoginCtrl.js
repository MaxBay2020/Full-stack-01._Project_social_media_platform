define(function(require) {
    let app = require('app')
    require('../services/loginService')

    const Swal = require('swal')

    app.controller('LoginCtrl', ['$http', '$state', 'loginService', 'titleService', function($http, $state, loginService, titleService){
        titleService.setTitle('Login')

        this.formObj={
            email:'',
            password: ''
        }

        //登陆方法
        this.login = () =>{
            $http.post('/login', this.formObj).then((data) => {

                if(data.data==='-2'){
                    //server error
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'It looks like there is something wrong with the server. Error code is -2',
                    })
                }else if(data.data==='0'){
                    //no such user
                    Swal.fire({
                        icon: 'info',
                        title: 'Oops...',
                        text: 'The user does not exist'
                    })
                }else if(data.data==='-1'){
                    //username or password incorrect
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'The email or password incorrect',
                    })
                }else if(data.data==='1'){
                    //login successfully
                    Swal.fire({
                        icon: 'success',
                        title: 'Good job!',
                        text: 'Login successfully',
                    }).then(()=>{
                        loginService.checkLogin()
                        $state.go('root.home')
                    })

                }
            })
        }

    }])
})
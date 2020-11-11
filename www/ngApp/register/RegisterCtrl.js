define(function(require) {
    let app = require('app')
    require('./registerService')
    require('../ngDirectives/passwordStrengthBar')
    require('../services/passwordStrengthService')
    //loginService在rootCtrl中被引用了，而这个页面是在root页面中的，所以这个不需要再次引入loginService服务了
    // require('../services/loginService')
    const Swal = require('swal')

    app.controller('RegisterCtrl', [
        'registerService',
         'titleService',
        'passwordStrengthService',
        '$state',
        'loginService',
            function(registerService, titleService, passwordStrengthService, $state, loginService) {
        //表单对象
        this.registerFormObj = {
            email:'',
            password1:'',
            password2:''
        }

        this.emailTip='Email address is invalid.'

        //更改页面标题
        titleService.setTitle('Register')


        this.showEmailTip = false;
        //查看邮箱是否被占用
        this.checkExist = () => {
            //从双向绑定中，得到email地址；通过正则验证才返回值，否则返回undefined
            let email = this.registerFormObj.email
            if(email){
                registerService.checkEmailExist(email, (data)=>{
                    if(data.data==='0'){ //0 can register, 1 user exists
                        this.showPassMark = true
                        this.showEmailTip=false
                    }else{
                        this.showEmailTip=true
                        this.emailTip='Email exists.'
                    }
                })
            }else {
                return
            }
        }

        //密码强度计算
         this.getStrength = function(){

            return passwordStrengthService.getStrength(this.registerFormObj.password1)
         }

         this.isMatch = false;
        //检查两次密码是否匹配
        this.passwordMatch = ()=>{
            if(this.registerFormObj.password1===this.registerFormObj.password2){
                this.isMatch = true
            }else{
                this.isMatch =false
            }
            return this.registerFormObj.password1===this.registerFormObj.password2
        }

        //注册用户
        this.doRegister = ()=>{
            registerService.doRegister(this.registerFormObj.email, this.registerFormObj.password1, (data) => {
                if(data.data==='1'){
                    //register successfully
                    Swal.fire(
                        'Good job!',
                        'You have registered successfully.',
                        'success'
                    )

                    //切换login状态
                    loginService.checkLogin(true)

                    //页面跳转到主页
                    $state.go('root.home')
                }else {
                    //register failed
                    Swal.fire({
                        title: 'Error!',
                        text: 'Oops! Register failed. Please try again.',
                        icon: 'error',
                        confirmButtonText: 'Cool'
                    })
                }
            })
        }

    }])
})
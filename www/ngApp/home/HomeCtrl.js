define(function(require){
    let app = require('app')
    let swal = require('swal')


    app.controller('HomeCtrl', ['titleService', 'loginService', '$http', function(titleService, loginService, $http){
        //更改title标题
        titleService.setTitle('Home')

        //全部的说说数据
        this.sayses = []

        //请求所有说说
        $http.get('/says').then((data)=>{
            console.log(data)
            this.sayses = data.data
        })

        this.getNickname = ()=>{
            return loginService.getNickname()
        }

        this.getEmail = ()=>{
            return loginService.getEmail()
        }

        this.getAvatar = () => {
            return loginService.getAvatar()
        }

        this.postComment = (event)=>{
            if(event.keyCode=== 13){
                //验证，不允许有html标签
                if(/<[a-zA-Z][^>]*>/.test(this.content)){
                    swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No HTML tag allowed.'
                    })
                    return this.content = ''
                }else if(this.content.trim()===''){
                    swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'It is empty.'
                    })
                }
                else{
                    $http.post('/says', {
                        params:{
                            content: this.content
                        }
                    }).then((data) => {
                        if(data.data==='1'){
                            this.content = ''
                            swal.fire({
                                icon: 'success',
                                title: 'Yah!',
                                text: 'Your says has been released.'
                            })
                        }
                    })
                }

            }
        }

        this.checkLogin=()=>{
            return loginService.getLogin()
        }
    }])
})
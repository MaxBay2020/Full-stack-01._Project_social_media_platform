define(function(require){
    let app = require('app')
    require('jquery')
    let swal = require('swal')

    //让app挂在切图指令cut-pic.js，装饰者模式
    require('../ngDirectives/cut-pic')

    app.controller('ProfileCtrl', ['titleService', '$http', 'FileUploader', '$state', function(titleService, $http, FileUploader, $state){
        //更改title标题
        titleService.setTitle('Profile')

        //切图的信息
        this.v = {
            w: 0,
            h: 0,
            x: 0,
            y:0
        }

        this.idx = 0 //0或1
        this.changeTab = function(num){
            this.idx=num
        }


        $http.get('/profile').then((user) => {
            this.formObj = user.data
        })

        this.uploader = new FileUploader({
            //上传地址
            url:'/upload',
            //自动上传
            autoUpload: true,
            //只能上传1张
            queueLimit: 1,
            //对文件类型进行过滤
            filters: [{
                name: 'filter',
                // A user-defined filter
                fn: function(item) {
                    //得到此文件的MIME类型：item.type
                    if(item.type.indexOf('jpg')!==-1 || item.type.indexOf('png')!==-1|| item.type.indexOf('jpeg')!==-1|| item.type.indexOf('bmp')!==-1){
                        return true
                    }
                    return false
                }
            }],
            //添加文件失败的时候
            onWhenAddingFileFailed: (item)=>{
                //文件类型不匹配，清空此文件
                this.uploader.clearQueue()

                //上传文件的input文字恢复成"请选择文件"
                $('#imgUpload').val('')

                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Please upload a image file!',
                })
            },
            //当传输完毕一张图片后做的事
            onCompleteItem: (item, response, status, headers)=>{
                if(response==='-2'){
                    //server error
                    swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Server error! Error code is -2.',
                    })
                }
                //验证图片大小是否合规
                if(response==='-1'){
                    swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'The minimum size of the image should be 100x100. Please check',
                    })
                    //清空队列，并且恢复input提示文字，方便下一次上传
                    this.uploader.clearQueue()
                    $('#imgUpload').val('')
                    return
                }
                //图片大小合规
                //清空队列，并且恢复input提示文字，方便下一次上传
                this.uploader.clearQueue()
                $('#imgUpload').val('')

                //用户上传的图片在服务器上的地址
                this.imgPath = response.file.path
                //显示大黑屏
                this.showCutBox=true
                //截取字符串前面的www，设置被裁切图片在服务器上的地址
                this.imgSrc=response.file.path.substr(4)
            }
        })

        //获得上传图片的地址
        this.imgSrc='/uploads/3.jpg'
        this.getImgSrc = () => {
            return this.imgSrc
        }

        //是否显示切图的大黑屏
        this.showCutBox = false

        //确认裁切按钮点击
        this.cut = ()=>{
            $http.get('/cut', {
                params: {
                    a: this.v.w / this.v.ratio,
                    h: this.v.h / this.v.ratio,
                    x: this.v.x / this.v.ratio,
                    y: this.v.y / this.v.ratio,
                    url:this.imgPath
                }
            }).then((data)=>{
                if(data.data==='1'){
                    alert('Good!')
                    // swal.fire({
                    //     icon: 'success',
                    //     title: 'Yah!',
                    //     text: 'Your avatar is good to go.'
                    // })

                    //关闭大黑屏
                    this.showCutBox=false
                    //因为浏览器向服务器访问过一张图片后，图片会放在缓存中。下次再访问同一张图片，浏览器不会再向服务器发出请求，而是从缓存中读取这张图片
                    // 解决方法：加入？和时间戳防止缓存，这样浏览器会强制发出请求
                    this.formObj.avatar = this.imgPath.substr(4)+'?'+Date.now()
                }
            })
        }

        //用户头像显示
        this.getAvatar=()=>{
            if(this.formObj){
                return this.formObj.avatar
            }else{
                return '/images/default_avatar.jpg'
            }

        }

        //发送POST请求更新用户资料
        this.updateProfile = ()=>{
            $http.post('/updateProfile', {
                params:this.formObj
            }).then((data) => {
                if(data.data==='1'){
                    swal.fire({
                        icon: 'success',
                        title: 'Yah!',
                        text: 'Update successfully.'
                    })
                    $state.go('root.home')
                }
            })
        }
    }])
})
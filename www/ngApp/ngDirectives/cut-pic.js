define((require) => {
    let app = require('app')
    require('jquery')
    require('jquery-ui')

    app.directive('cutPic', [function() {
        return {
            restrict: 'E',
            templateUrl: 'ngApp/ngDirectives/cut-pic.html',
            scope: {
                img:'@',
                v:'=',
                maxwidth: '@',
                maxheight: '@'
            },

            link: function($scope, ele){
                //第一个业务：当图片加载完之后，设置大盒子宽高和图片一样，让大图盒子和图片和一样的宽高；
                //图片已经限制了最大高和最大宽
                let $bigImg = $(ele).find('.bigImg')
                let $bigBox =  $(ele).find('.bigBox')
                let $cutImg = $(ele).find('.cutImg')

                //上传图片的宽度和高度
                let bigImgW
                let bigImgH



                let cutObj = $scope.v
                cutObj.w=100
                cutObj.h=100
                cutObj.x=0
                cutObj.y=0


                //图片加载完之后做的事情
                $bigImg.bind('load', function(){
                    //得到大图的宽高
                    bigImgW=$bigImg.width()
                    bigImgH=$bigImg.height()


                    //图片原始宽高
                    let realWidth = $(ele).find('.bigImg2').width()
                    let realHeight = $(ele).find('.bigImg2').height()
                    //计算比例，将结果写在cutObj中
                    cutObj.ratio = bigImgW/realWidth


                    $bigBox.css({
                        width: bigImgW,
                        height: bigImgH
                    })

                    //让cutImg宽高和图片一致
                    $cutImg.css({
                        width: bigImgW,
                        height: bigImgH
                    })

                })


                //第二个业务，图片裁切框能拖拽
                let $cut = $(ele).find('.cut')
                //让cut框能够拖拽
                $cut.draggable({
                    //限制拖拽的范围
                    containment: $bigBox,
                    //拖拽时候做的事情
                    drag: function (event, ui){
                        //拖拽的时候做的事情
                        cutObj.x = ui.position.left
                        cutObj.y = ui.position.top
                        //让cut框的img背景图片向相反方向移动就形成了我们要的效果
                        $cutImg.css({
                            left: -cutObj.x,
                            top: -cutObj.y
                        })

                        //设置3个预览框
                        setPreviewBoxImg($(ele).find('.previewLBox'), 100,100)
                        setPreviewBoxImg($(ele).find('.previewMBox'), 70,70)
                        setPreviewBoxImg($(ele).find('.previewSBox'), 40,40)
                    }
                }).resizable({
                    aspectRatio:1/1,
                    //改变大小时限制的范围
                    containment: $bigBox,
                    resize: function(event, ui){
                        //改变尺寸时做的事情
                        cutObj.w = ui.size.width
                        cutObj.h = ui.size.height
                        //设置3个预览框
                        setPreviewBoxImg($(ele).find('.previewLBox'), 100,100)
                        setPreviewBoxImg($(ele).find('.previewMBox'), 70,70)
                        setPreviewBoxImg($(ele).find('.previewSBox'), 40,40)
                    }
                })

                function setPreviewBoxImg($boxEle, boxWidth, boxHeight){
                    let w = bigImgW / cutObj.w * boxWidth
                    let h = bigImgH / cutObj.h * boxHeight
                    let x = cutObj.x * boxWidth / cutObj.w
                    let y = cutObj.y * boxHeight / cutObj.h

                    $boxEle.find('img').css({
                        width: w,
                        height: h,
                        left: -x,
                        top: -y
                    })
                }
            }
        }
    }])
})
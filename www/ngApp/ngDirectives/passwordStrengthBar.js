define(function(){
    let app = require('app')
    require('jquery')

    app.directive('passwordStrengthBar', [function (){
        return {
            scope: {
                //从strength属性中读取值
                'strength': '@'
            },
            restrict: 'E',
            templateUrl: 'ngApp/ngDirectives/passwordStrengthBar.html',
            link: function($scope, ele){

                let arrowWidth = $(ele).find('.arrow').width()
                let barWidth = $(ele).find('.passwordStrengthBar').width()

                // $scope.strength = 2, //0,1,2,3,4

                $scope.getPosition = function(){
                    return {
                        left: (barWidth/5)* $scope.strength + (barWidth/5)/2 - arrowWidth/2 +'px'
                    }
                }
            }
        }
    }])
})
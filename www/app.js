define(function (require, exports, module) {
    var angular = require('angular');
    var asyncLoader = require('angular-async-loader');

    require('angular-ui-router');
    require('angularfileupload')

    var app = angular.module('app', ['ui.router', 'angularFileUpload']);

    //定义一个最大的控制器
    app.controller('MainCtrl', ['titleService', function (titleService){
        this.getTitle = function () {
            return titleService.getTitle()
        }
    }])

    //控制页面title标题文字
    app.factory('titleService', function(){
        let title = ''

        return {
            getTitle: function(){
                return title
            },
            setTitle: function(str){
                title=str
            }
        }
    })

    // initialze app module for angular-async-loader
    asyncLoader.configure(app);

    module.exports = app;
});
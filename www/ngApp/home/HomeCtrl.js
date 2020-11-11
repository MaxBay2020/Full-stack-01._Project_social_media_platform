define(function(require){
    let app = require('app')


    app.controller('HomeCtrl', ['titleService', function(titleService){
        //更改title标题
        titleService.setTitle('Home')
    }])
})
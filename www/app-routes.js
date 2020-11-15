define(function (require) {
    var app = require('./app');

    app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('root', {
                templateUrl: './ngApp/root/root.html',
                controllerUrl: './ngApp/root/RootCtrl',
                controller: 'RootCtrl as rootCtrl'
            })
            .state('root.home', {
                url: '/home',
                templateUrl: './ngApp/home/home.html',
                controllerUrl: './ngApp/home/HomeCtrl',
                controller: 'HomeCtrl as homeCtrl'
            })
            .state('root.register', {
                url: '/register',
                templateUrl: './ngApp/register/register.html',
                controllerUrl: './ngApp/register/RegisterCtrl',
                controller: 'RegisterCtrl as registerCtrl'
            })
            .state('root.login', {
                url: '/login',
                templateUrl: './ngApp/login/login.html',
                controllerUrl: './ngApp/login/LoginCtrl',
                controller: 'LoginCtrl as loginCtrl'
            })
            .state('root.profile', {
                url:'/profile',
                templateUrl: './ngApp/profile/profile.html',
                controllerUrl: './ngApp/profile/ProfileCtrl',
                controller: 'ProfileCtrl as profileCtrl'
            })

    }]);
});
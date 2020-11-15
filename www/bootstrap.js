require.config({
    baseUrl: '/',
    paths: {
        'angular': 'assets/angular/angular.min',
        'angular-ui-router': 'assets/angular-ui-router/release/angular-ui-router.min',
        'angular-async-loader': 'assets/angular-async-loader/angular-async-loader.min',
        'jquery': 'assets/jquery/dist/jquery.min',
        'bootstrap': 'assets/bootstrap/dist/js/bootstrap',
        'swal': 'assets/sweetalert2/sweetalert2',
        'angularfileupload': 'assets/angular-file-upload/dist/angular-file-upload.min',
        'jquery-ui': 'assets/jquery-ui/jquery-ui.min'
    },
    shim: {
        'angular': {exports: 'angular'},
        'jquery': {exports: 'jquery'},
        'angular-ui-router': {deps: ['angular']},
        'bootstrap': {deps:['jquery']},
        'swal': {exports: 'swal'},
        'angularfileupload': {deps: ['angular']},
        'jquery-ui': {deps: ['jquery']}
    }
});

require(['angular', './app-routes'], function (angular) {
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['app']);
        angular.element(document).find('html').addClass('ng-app');
    });
});
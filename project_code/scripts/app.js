var myApp = angular.module('app',['firebase']);



myApp.controller('mainController',function($scope, $firebase) {
 	var ref = new Firebase("https://cardeoldata.firebaseio.com/");
	$scope.fdata = $firebase(ref);	
});
 

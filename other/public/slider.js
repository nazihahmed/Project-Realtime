;

(function($,io,angular,window,undefined){
  	'use strict';

  	var app = angular.module("slider",["media","ngImgCrop","ngAnimate"]);

  	app.controller("mainCRTL", function($scope, mediaService) {
      $scope.files = [];
      mediaService.getFiles(function(res,status) {
        if(status) {
          $scope.files = res;
        } else {
          giveMessage('Error', res.message);
        }
      });
      // $scope.uploadFile = function() {
      //   if($('.file-input').val().length > 1) {
      //     console.log($('.file-input').val());
      //   } else {
      //     giveMessage('Error', 'Please Select A file');
      //   }
      // }
  	});

})(jQuery,io,angular,this);
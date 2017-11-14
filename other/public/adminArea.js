;

(function($,io,angular,window,undefined){
  	'use strict';

  	var socket = io();

  	var app = angular.module("adminArea",["article"]);

  	app.controller("mainCRTL", function($scope, articleService) {
  		$scope.currentArticle = {};

  		$scope.addArticle = function(article) {
			console.log('called');
  			articleService.saveArticle(article,function(article,err) {
  				if(!err) {
  					socket.emit('articles update', article);
  					giveMessage("Success", "The article has been Published");
  					$scope.currentArticle = {};
  				} else {
  					giveMessage("Error", "There was a problem while saving the article");
  					console.log(err);
  				}
  			});
  		}

  		$scope.handleClick = function() {
  			if($scope.articleForm.$valid) {
	  			$scope.addArticle($scope.currentArticle);
  			} else {
  				giveMessage("Error", "Please Fill in the Required Fields Correctly");
  			}
  		}

  	});

})(jQuery,io,angular,this);
;

(function($,io,angular,window,undefined){
  	'use strict';

  	var socket = io();

  	var app = angular.module("articles",["data","article","ngAnimate"]);

  	app.controller("mainCRTL", function($scope, $filter,dataService, articleService) {
      $scope.articles = [];
  		dataService.getArticles(function(response,err) {
        if(!err) {
          $scope.articles = response;
          $scope.$apply();
        } else {
          giveMessage("error", "there was a problem with communicating with the server");
          console.log(err);
        }
      });

      $scope.editMode = false;

      $scope.removeArticle = function(index) {
        articleService.removeArticle($scope.articles[index].id,function(status,err) {
          if(status) {
            $scope.articles.splice(index,1);
            $scope.$apply();
            socket.emit('articles update');
            giveMessage("Success", "The artice has been removed");
          } else if (err) {
            giveMessage("Error", "The artice hasn't been removed");
          }
        });
      }

      $scope.enterEditMode = function(article,index) {
        $scope.currentArticle = article;
        $scope.currentArticle.time = new Date(article.time); 
        $scope.editMode = true;
        $scope.currentArticle.index = index;
      };

      $scope.saveCurrent = function() {
        var index = $scope.currentArticle.index + 0;
        $scope.currentArticle.index = undefined;
        if($scope.editForm.$valid) {
          articleService.updateArticle($scope.currentArticle.id,$scope.currentArticle, function(status,data){
            if (status) {
              giveMessage("Success", "The artice has been Saved");
              $scope.editMode = false;
              $scope.articles[index] = $scope.currentArticle;
              $scope.$apply();
              socket.emit('articles update');
            } else {
              giveMessage("Error", "The artice hasn't been Saved");
            }
          });
        } else {
          giveMessage("Error", "Please fill in the required fields properly");
        }
        
      };

      $scope.cancelCurrent = function() {
        $scope.currentArticle = {};
        $scope.editMode = false;
      }
  	});

})(jQuery,io,angular,this);
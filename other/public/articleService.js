;

(function($,io,angular,window,undefined){
  	'use strict';

  	// var socket = io();

  	var app = angular.module("article",[]);

  	app.factory("articleService", function() {

  		return {
  			saveArticle: function(article, fn) {
  				dpd.schoolarticles.post(article, function(newArticle, error) {
				  if (error) {
				  	fn(newArticle,error);
				  } else {
				  	fn(newArticle,false);
				  }
				});
  			},
  			removeArticle: function(id, fn) {
  				dpd.schoolarticles.del(id, function (err) {
				  if(err) fn(false,err);
				  fn(true);
				});
  			},
  			updateArticle: function(id, newArticle, fn) {
  				dpd.schoolarticles.put(id, newArticle, function(result, err) {
				  if(err) fn(false,err);
				  fn(true,result);
				});
  			},
  			getArticle: function(id, fn) {
  				dpd.schoolarticles.get(id, function (result,err) {
					if(err) fn(false,err);
					fn(true,result);
				});
  			}
  		}
  	})

})(jQuery,io,angular,this);
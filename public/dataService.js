;

(function($,angular,window,undefined) {

	'use strict';

	var app = angular.module("data",[]);

	app.factory("dataService", function() {
		console.log("data service");
		return {
			getArticles : function(fn) {
				dpd.schoolarticles.get(function(articles, error) { 
		            if(!error) {
		                fn(articles);
		            } else {
		                fn(false,error);
		            }
		        });
			},
			getSlides: function(fn) {
				console.log('in');
              dpd.media.get(function(result, err) {
                if (err) fn(err, false);
                fn(result, true);
              });
			}
		}
	})

})(jQuery,angular,this);
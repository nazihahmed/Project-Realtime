
;

(function($,angular,window,undefined) {

	'use strict';

	var app = angular.module("schoolApp");

	app.factory("loginService", function() {

		return {
			loggedIn: function(fn) {
				dpd.users.me(function(me) {
					if (me.username == "Admin") {
					  fn(true);
					} else {
					  fn(false);
					}
				});
			}
		}
	})

})(jQuery,angular,this);
;

(function($,io,window,undefined){
  	'use strict';

	var regex = /^[A-Z]+[\d\WA-Z]*[a-z]+[A-Za-z\d\W]*$|^[a-z]+[\d\Wa-z]*[A-Z]+[A-Za-z\d\W]*$|^[\d\W]+[a-z]+[\d\W]*[A-Z]+[A-Za-z\d\W]*$|^[\d]+[A-Z]+[\d\W]*[a-z]+[A-Za-z\d\W]*$/g

	function getUser(fn) {
		dpd.users.me(function(me) {
		  fn(me);
		});
	}

  	function updateDetails(data) {
  		getUser(function(user) {
			dpd.users.put(user.id, data, function(result, err) {
			  if(err) return giveMessage(err,err.status);
			  giveMessage("Your password has been changed", "Success");
			});
  		});
  	}

  	function validatePassword(password,confirmation, fn) {
  		if(password != confirmation) {
  			fn("Please make sure that the passwords match",false);
  			return false;
  		} else if (!password.match(regex)) {
  			fn("Please make sure that the password has at least 1 number and 1 Big letter and 1 small letter",false);
  			return false;
  		} else {
  			fn("ok",true);
  		}
  		return true;
  	}

  	$('#account-form').submit(function(e) {
		e.preventDefault();

		// Get the data from the form
  		var password = $('#password').val(),
  			passwordConfirm = $('#password-confirm').val(),
			data = {
				password: password,
				loggedIn: false
			};

		validatePassword(password,passwordConfirm,function(message,status) {
			if(status) {
				updateDetails(data);
				logout();
			} else {
				giveMessage(message,"Error");
			}
		});

  		return false;
  	});

})(jQuery,io,this);
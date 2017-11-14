;

(function($,io,window,undefined){
    'use strict';

    window.socket = io();
    var id;

    function loggedIn(fn) {
        dpd.users.me(function(me) {
          if (me.username == "Admin") {
            fn(true);
          } else {
            fn(false);
          }
          id=me.id;
          console.log(id);
        });
        function loggedIn() {
          console.log('once only');
        }
    }

    window.giveMessage = function(message,header) {
        $.jGrowl(message, header ? { header: header } : undefined);
    };

    function redirect() {
        window.location = window.location.origin + "/admin";
    }

    window.logout = function () {
      loggedIn(function(status) {
        if(status) {
          dpd.users.logout(function(err) {
            if(err) {
              console.log(err); 
            } 
            setTimeout(function() {
              window.socket.emit('login', {status:false, id: id});
            },0);
            setTimeout(function() {
              socket.disconnect();
              redirect();
            },1000);
          });
        } else {
          console.log(' the id is (!!): ')
          setTimeout(function() {
            window.socket.emit('login', {status:false, id: id});
          },0);
          setTimeout(function() {
            socket.disconnect();
            redirect();
          },1000);
        }
      });  
    }

    // window.socket.on('redirect', function() {
    //   redirect();
    // });

    $('#logout').click(function() {
        console.log('click');
        window.logout();
    });

})(jQuery,io,this);
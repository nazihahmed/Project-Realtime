;

(function($,io,angular,window,undefined){
  	'use strict';

  	var app = angular.module("media",[]);

  	app.provider("mediaService", function() {

      var maindir = 'media';

  		return {
        maindir: function(val) {
          maindir = val;
        },
  			$get: function($http) {
          return {
            uploadFile: function(subdir, unique, fn) {
              var req = {
               method: 'POST',
               url: '/'+maindir,
               headers: {
                 'Content-Type': "multipart/form-data"
               },
               data: { subdir: subdir,  uniqueFilename: (typeof unique == "boolean")?unique:false}
              }
              $http.post(req).then(function(res) {
                fn(res.data, true);
              }, function(res) {
                fn(res.data, false);
              });
            },
            getFiles: function(fn) {
              dpd.media.get(function(result, err) {
                if (err) fn(err, false);
                fn(result, true);
              });
            },
            deleteFile: function(id, fn) {
              dpd.media.del(id, function(result, err) {
                if (err) fn(err, false);
                fn(result, true);
              });
            }
          }
        }
  		}
  	})

})(jQuery,io,angular,this);
var PORT = 3000;
var ENV = process.env.NODE_ENV || 'development'; // change to production

// setup http + express + socket.io
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server, {'log level': 0});
var getmac = require('getmac');
// var dpd = require('deployd');

app.get('/admin',function(req,res,next){
  loggedIn(function(status,result) {
    if(status && result.addresses.indexOf(req.connection.remoteAddress.trim()) !== -1 ){
      res.redirect('/adminArea');
    } else {
      next();
    }
  });
}, function(req, res){
  res.sendFile(__dirname + '/other/admin.html');
});


var dpd = require('dpd-js-sdk')();

dpd.users = dpd("/users"); // you have to manually add your resources like so

function queryLogin(query,fn) {
  setTimeout(function() {
    dpd.users.get(query, function (res,err) {
      if(err) {
        console.log('something is wrong');
      }
      try {
        if(res.length>0) {
          console.log('we are in : ',res[0].addresses);
          fn(true,res[0]);
        } else {
          fn(false);
        }
      } catch (e) {

      }

    });
  },0);
}

function loggedIn(fn,addr) {
  var query = {"loggedIn":true};
  if(addr) {
    query["addresses"] = [addr.trim()];
    console.log(addr);
    queryLogin(query,fn);
  } else {
    queryLogin(query,fn);
  }
}

function login(id,addr) {
  loggedIn(function(status,user) {
    if(status) {
      // already in
      console.log('already in');
      var addresses = user.addresses;
      addresses.push(addr.trim());
      dpd.users.put(id,{"addresses":addresses}, function (result,err) {
        if(err) return console.log('login err:', err);
        console.log("login :: ",result);
        io.emit('loginSuccess');
      });
    } else {
      console.log("already out");
      dpd.users.put(id,{"loggedIn":true,"addresses":(addr == '::1' || addr == '::ffff:127.0.0.1') ? ['::1','::ffff:127.0.0.1'] : [addr]}, function (result,err) {
        if(err) return console.log('login err:', err);
        console.log("login :: ",result);
        io.emit('loginSuccess');
      });
    }
  });
}

app.use('/static', isLoggedIn, express.static(__dirname + '/other/public'));

function logout(id,addr) {
  loggedIn(function(status,user) {
    if(status) {
      if (user.addresses.length == 1) {
        dpd.users.put(id,{"loggedIn":false,"addresses":[]}, function (result,err) {
          if(err) return console.log('login err:', err);
          console.log("logout :: ",result);
        });
      } else if (user.addresses.length > 1){
        var addresses = user.addresses;
        if(addr == '::1' || addr == '::ffff:127.0.0.1') {
          if (addresses.indexOf('::1') != -1) {
            addresses.splice(addresses.indexOf('::1'),1);
          }
          if (addresses.indexOf('::ffff:127.0.0.1') != -1) {
           addresses.splice(addresses.indexOf('::ffff:127.0.0.1'),1);
          }
        } else {
          addresses.splice(addresses.indexOf(addr.trim()),1);
        }
        dpd.users.put(id,{"loggedIn":(user.addresses.length < 1)?false:true,"addresses":addresses}, function (result,err) {
          if(err) return console.log('login err:', err);
          console.log("logout :: ",result);
        });
      }
    } else {
      dpd.users.put(id,{"loggedIn":false,"addresses":[]}, function (result,err) {
        if(err) return console.log('login err:', err);
        console.log("logout :: ",result);
      });
    }
  });
}

function isLoggedIn(req,res,next) {
  var ip = req.connection.remoteAddress;
  var ip2;
  if (ip.indexOf('::ffff:127.0') != -1) {
    ip2 = '::1';
  } else if (ip.indexOf('::1') != -1) {
    ip2 = '::ffff:127.0.0.1';
  }
  console.log("the ip is :", ip);
  loggedIn(function(status, user) {
    if(status && (user.addresses.indexOf(ip.trim()) !== -1 || user.addresses.indexOf(ip2) !== -1 )) {
      console.log("loggedin : ", req.connection.remoteAddress.trim());
      next();
    } else {
      console.log("logged out : ", req.connection.remoteAddress.trim());
      res.status(404);
      res.redirect('/admin');
    }
  });
}

app.get('/adminArea',isLoggedIn, function(req, res){
  res.sendFile(__dirname + '/other/adminArea.html');
});

app.get('/adminAccount',isLoggedIn, function(req, res){
  res.sendFile(__dirname + '/other/adminAccount.html');
});

app.get('/articles',isLoggedIn, function(req, res){
  res.sendFile(__dirname + '/other/articles.html');
});

app.get('/slider',isLoggedIn, function(req, res){
  res.sendFile(__dirname + '/other/slider.html');
});

// setup deployd
var srv = require('deployd').attach(server, {
    socketIo: io,  // if not provided, attach will create one for you.
    env: ENV,
    // db: {host:'localhost', port:27017, name:'test-app'}
    // credentials: {
    //   username: 'Admin',
    //   password: '651425'
    // }

    // mongodb://<dbuser>:<dbpassword>@ds011314.mlab.com:11314/school_project

    db: {
      host: 'ds011314.mlab.com',
      port: 11314,
      name: 'school_project',
      credentials: {
        username: 'Admin',
        password: '10021999'
      }
    }
});

// srv.sockets.manager.settings.transports = ["xhr-polling"];

io.on('connection', function(socket){
  // address = socket.handshake.address;

  socket.on('disconnect', function(){
    console.log('disconnected');
  });

  socket.on('articles update', function(data) {
  	io.emit('articles update', data);
  });

  socket.on('newslide', function(response) {
    io.emit('slider update',response);
  });

  socket.on('slide removed', function(response) {
    io.emit('slide removed',response);
  })

  socket.on('login', function(data) {
    if(data.status === true) {
      console.log("get in");
      console.log('socket ip', socket.handshake.address);
      login(data.id,socket.handshake.address);
    } else {
      console.log('received out emit');
      logout(data.id,socket.handshake.address);
    }
  });
});

// After attach, express can use server.handleRequest as middleware
app.use(server.handleRequest);

server.listen(PORT, function(){
  console.log('listening on *:'+PORT);
});

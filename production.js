// production.js
var deployd = require('deployd');

var server = deployd({
  port: process.env.PORT || 5000,
  env: 'production',
  db: {
    host: 'my.production.mongo.host',
    port: 27105,
    name: 'my-db',
    credentials: {
      username: 'username',
      password: 'password'
    }
  }
});

server.listen();

server.on('listening', function() {
  console.log("Server is listening");
});

server.on('error', function(err) {
  console.error(err);
  process.nextTick(function() { // Give the server a chance to return an error
    process.exit();
  });
});
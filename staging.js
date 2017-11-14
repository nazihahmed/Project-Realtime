// staging.js
var deployd = require('deployd');

var server = deployd({
  port: process.env.PORT || 3000,
  env: 'staging',
  db: {
    host: 'localhost',
    port: 27017,
    name: 'test'
  }
});

// remove all data in the 'todos' collection
var todos = server.createStore('todos');

todos.remove(function() {
  // all todos removed
  server.listen();
});

server.on('error', function(err) {
  console.error(err);
  process.nextTick(function() { // Give the server a chance to return an error
    process.exit();
  });
});
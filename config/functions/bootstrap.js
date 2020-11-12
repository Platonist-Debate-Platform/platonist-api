'use strict';


/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

module.exports = () => {
  var io = require('socket.io')(strapi.server);
  
  io.on('connection', function(socket){
    const interval = setInterval(() => {
      socket.emit('hello', JSON.stringify({message: 'Hello food lover'}));
    }, 1000);
    
    socket.on('disconnect', () => {
      console.log('a user disconnected');
      clearInterval(interval);
    });
  });
  strapi.io = io;
};

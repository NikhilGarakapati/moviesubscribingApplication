const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
// process.on('uncaughtException', (ex)=>{
//   winston.error(ex.message, ex);      
//   process.exit(1);                     // To log Exceptions
// });


winston.exceptions.handle(   
    new winston.transports.Console({ colorize:true, prettyPrint: true}),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );
  
  process.on('unhandledRejection', (ex)=>{  // to log unhandled promise rejections
    throw(ex);  // we are logging unhandled rejections and uncaught expections in uncaugt.log         
  });
  
  winston.add(new winston.transports.File({filename: 'logfile.log'}));
  //transport is a storage file consists of console, file, http. 
  winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost:27017/vidly'}));
}



// logging structure
// 1 emmiting using process method -- uncaught exception
// 2 logging them into uncaughtExceptions.log
// 3 emitting using process method -- unhandled rejection
// 4 wont store in uncaughtExceptions.log-- have to create another one
// 5 instead throw exception from unhandled rejection, storing in uncaughtExcpetions.log

// 6 logfile.log stores compile time errors
// ```

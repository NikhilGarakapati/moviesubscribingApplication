const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');


module.exports = function(){
// process.on('uncaughtException', (ex)=>{
//   winston.error(ex.message, ex);      
//   process.exit(1);                     // To log Exceptions
  
// });
winston.exceptions.handle(   
    new winston.transports.Console({ colorize:true, prettyPrint: true}),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );
  // to log unhandled promise rejections
  
  process.on('unhandledRejection', (ex)=>{
    throw(ex);                       // TO log promise rejection
  });
  
  winston.add(new winston.transports.File({filename: 'logfile.log'}));
  //transport is a storage file consists of console, file, http. 
  // winston.add(new winston.transports.MongoDB({ db: 'mongodb://localhost:27017/vidly'}));
}
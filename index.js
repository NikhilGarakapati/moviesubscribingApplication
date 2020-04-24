const express = require('express');
const app = express();
const winston = require('winston');

require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();


//winston expection handling code moved to startup/logging.js

//configuration file deals with jwtprivateKey moved to startup/config.js


//routes moved to startup/routes.js

//mongoose startup code moved to startup/db.js



const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));



const hemlet = require('helmet');
const compression = require('compression');

//getting the application code

module.exports = function(app){
    add.use(hemlet());
    add.use(compression());
}
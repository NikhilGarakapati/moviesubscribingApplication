const config = require('config');   


module.exports = function (){
    if(!config.get('jwtprivateKey')){
        throw new Error('FATAL ERROR: jwtprivateKey is not defined');
    }
}
module.exports = function (req, res ,next){
    if(!req.user.isAdmin) return res.status(403).send('Access denied.');
    //401 unauthorized //403 Forbidden
    next();
}
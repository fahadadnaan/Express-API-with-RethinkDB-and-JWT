const jwt = require('jwt-simple');
const moment = require('moment');
const secret = process.env.TOKEN_SECRET;
const Promise = require('bluebird');

module.exports.generate =  (user) => {
return new Promise( (resolve, reject) => {
    const expires = moment().add(7, 'days').valueOf();
    const newToken = jwt.encode({ iss: user.email, exp: expires }, secret);
    reject(new Error('Token Generate Failed'));
    return resolve(newToken) ;
});
};

module.exports.verify =  (token, next) => {
    try {
        if(!token) {
            const notFoundError = new Error('Token not found');
            notFoundError.status = 404;
            return next(notFoundError);
        }
    
        if(jwt.decode(token, secret) <= moment().format('x')) {
            const expiredError = new Error('Token has expired');
            expiredError.status = 401;
            return next(expiredError);
        }
    } catch (error) {
     return('Token Verify Failed');
    }
   
};

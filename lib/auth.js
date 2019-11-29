const bcrypt = require('bcrypt');
const token = require('./token');
const Promise = require('bluebird');


module.exports.authorize = (request, response,next ) => {
    return new Promise(async (resolve, reject) => {
        const apiToken = request.headers['x-api-token'];
        if (apiToken !== null)
         resolve(token.verify(apiToken, next));
        else
        reject('Header Failed');
        next();
    });
};

module.exports.hash_password = function (password) {
    return new Promise( (resolve, reject) => {
        bcrypt.genSalt(10, (error, salt) => {
            if(error) return reject(error);

            bcrypt.hash(password, salt, (error, hash) => {
                if(error) return reject(error);
                return resolve(hash);
            });
        });
    });
};

module.exports.authenticate = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (error, response) => {
            if(error) return reject(error);
            return resolve(response);
        });
    });
};

const express = require('express');
const rdb = require('../lib/rethink');
const auth = require('../lib/auth');
const token = require('../lib/token');

const router = express.Router();

router.post('/', async (request, response, next) => {
   try {
    await rdb.findBy('users', 'email', request.body.email)
    .then( (user) => {
        user = user[0];

        if(!user) {
            const userNotFoundError = new Error('User not found');
            userNotFoundError.status = 404;
            return next(userNotFoundError);
        }

        auth.authenticate(request.body.password, user.password)
        .then( (authenticated) => {
            if(authenticated) {
                const currentUser = {
                    name: user.name,
                    email: user.email,
                    token: token.generate(user)
                };

                response.json(currentUser);
            } else {
                const authenticationFailedError = new Error('Authentication failed');
                authenticationFailedError.status = 401;
                return next(authenticationFailedError);
            }
        });
    });
   } catch (error) {
    return next(error); 
   }
});

module.exports = router;
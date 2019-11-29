const express = require('express');
const rdb = require('../lib/rethink');
const auth = require('../lib/auth');
const moment = require('moment');
const date_format = moment().format('YYYY-MM-DD h:mm:ss a');
const router = express.Router();

router.post('/', async (request, response, next) => {
 try {
    await rdb.findBy('users', 'email', request.body.email)
    .then( (user) => {
        user = user[0];
        if(user) {
            const mismatchUser = new Error('mismatch User');
            mismatchUser.status = 400;
            return next(mismatchUser);
        }

       auth.hash_password(request.body.password)
        .then( (hash) =>{
            const newUser = {
                name: request.body.name,
                email: request.body.email,
                password: hash,
                created_at: date_format,
                updated_at: date_format
            };
            rdb.save('users', newUser)
            .then(result => response.status(201).json(result));
        });
    });
    next();
 } catch (error) {
    return next(error);
 }
});
module.exports = router;

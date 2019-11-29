const express = require('express');
const rdb = require('../lib/rethink');
const auth = require('../lib/auth');
const moment = require('moment');
const date_format = moment().format('YYYY-MM-DD h:mm:ss a');

const router = express.Router();

router.get('/', auth.authorize, async (request, response,next) => {
    try {
        await rdb.findAll('users').then(users => response.json(users, 200));
        next();
    } catch (error) {
        return next(error);
    }
});

router.get('/:id', auth.authorize, async (request, response, next) => {
   try {
    await rdb.find('users', request.params.id)
    .then( (user) => {

        if(!user) {
            const notFoundError = new Error(`There is no user with the id of ${req.params.id}`);
            notFoundError.status = 404;
            return next(notFoundError);
        }
        response.json(user, 200);
    });
    next();
   } catch (error) {
    return next(error);
   }
});


router.put('/:id', auth.authorize, async (request, response, next) => {
    try {
     await rdb.find('users', request.params.id)
     .then( (user) => {
         const updateUser = {
             name: request.body.user || user.name,
             email: request.body.email || user.email
         };
         rdb.edit('users', user.id, updateUser)
         .then(result => response.json(result, 200));
     });
    } catch (error) {
     return next(`There is no User with the id of ${request.params.id}`);
    }
 });

router.delete('/:id', auth.authorize, async (request, response, next) => {
    try {
        await rdb.destroy('users', request.params.id)
        .then(result => response.json(result, 204));
    next();
   } catch (error) {
    return next(`User with ID ${request.params.id} does not exists`);
   }
});

module.exports = router;

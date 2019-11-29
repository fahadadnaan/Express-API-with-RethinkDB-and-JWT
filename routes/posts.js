const express = require('express');
const rdb = require('../lib/rethink');
const auth = require('../lib/auth');
const moment = require('moment');
const date_format = moment().format('YYYY-MM-DD h:mm:ss a');
const router = express.Router();

// Get Posts
router.get('/', auth.authorize, async (request, response,next) => {
    try {
        await rdb.findIndexed('posts','created_at').then(result => response.status(200).json(result));
        next();
    } catch (error) {
        return next(error);
    }
});
// Get by pagination
router.get('/pagination', auth.authorize, async (request, response,next) => {
    let offset = +request.query.offset;
    let limit = +request.query.limit;
    try {
        await rdb.pagination('posts','created_at',offset,limit).then(result => response.status(200).json(result));
    } catch (error) {
        return next(error);
    }
});
// Search for Post
router.get('/search', auth.authorize, async (request, response,next) => {
    let value = request.query.title;
    try {
        await rdb.findByMatch('posts','title',value).then(result => response.status(200).json(result));

    } catch (error) {
        return next(error);
    }
});

// Add Post
router.post('/',auth.authorize, async (request, response, next) => {
    const newPost = {
        title: request.body.title,
        content: request.body.content,
        auther: request.body.auther,
        created_at: date_format,
        updated_at: date_format
    };
    try {
        await rdb.save('posts', newPost)
            .then(result => response.status(201).json(result));
            next();
        } catch (error) {
            return next(error);
        }
   });

// Get Single Post
router.get('/:id',auth.authorize, async (request, response, next) => {
    try {
     await rdb.find('posts', request.params.id)
     .then( (post) => {
         if(!post) {
             const notFoundError = new Error(`There is no post with the id of ${req.params.id}`);
             notFoundError.status = 404;
             return next(notFoundError);
         }
         response.status(200).json(post);
     });
     next();
    } catch (error) {
     return next(error);
    }
 });


 router.put('/:id', auth.authorize, async (request, response, next) => {
    try {
     await rdb.find('posts', request.params.id)
     .then( (post) => {
         const updatePost = {
            title: request.body.title || post.title,
            content: request.body.content || post.content,
            auther: request.body.auther || post.auther,
            updated_at: date_format,
         };
         rdb.edit('posts', post.id, updatePost)
         .then(result => response.status(200).json(result));

     });
    } catch (error) {
        return next(error);
    }
 });

 // Delete Post
 router.delete('/:id',auth.authorize, async (request, response, next) => {
    try {
        await rdb.destroy('posts', request.params.id)
        .then(result => response.status(204).json(result));
    next();
    } catch (error) {
     return next(error);
    }
 });

 module.exports = router;

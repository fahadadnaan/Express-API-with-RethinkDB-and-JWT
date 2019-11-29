const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");
var xss = require('xss-clean')

require('dotenv').config();

const users = require('./routes/users');
const login = require('./routes/login');
const register = require('./routes/register');
const posts = require('./routes/posts');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


// set routes
app.use('/users', users);
app.use('/login', login);
app.use('/register', register);
app.use('/posts', posts);


// App Security
app.use(express.json({ limit: '10kb' })); // Body limit is 10
const limit = rateLimit({
    max: 100,// max requests
    windowMs: 60 * 60 * 1000, // 1 Hour
    message: 'Too many requests' // message to send
});
app.use('/register', limit); // Setting limiter on specific route 
//app.use(limiter); //  apply to all requests if you want

app.use(xss()); // Data Sanitization against XSS
app.use(helmet()); // Give your project special HTTP headers using helmet dependency.

// End App Security


app.use(function (error, request, response, next) {
    response.status(error.status || 500);
    response.json({ error: error.message });
});

const server = app.listen(3000, function () {
    const host = server.address().address;
    const port = server.address().port;

    console.log('App is listening on http://%s:%s', host, port);
});

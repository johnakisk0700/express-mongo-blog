import errorHandler from './errors/errorHandler';
import { Response } from 'express';

var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var compression = require('compression');

var passport = require('passport');

// route init
import auth from './routes/auth';
import category from './routes/category';
import post from './routes/post';
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import subscribe from './routes/subscribe';
import comments from './routes/comment';

mongoose
    .connect('mongodb://localhost/freebirth-blog-cms', {})
    .then(() => console.log('connection with DB successful'))
    .catch((err: any) => console.error(err));

var app = express();

app.use(passport.initialize());
app.use(cors());
app.use(compression({ filter: shouldCompress }));
function shouldCompress(req: any, res: any) {
    if (req.headers['x-no-compression']) {
        // don't compress responses with this request header
        return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
}

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../', 'client', 'dist', 'client')));

app.use('/index', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', auth);
app.use('/api/category', category);
app.use('/api/post', post);
app.use('/api/comments', comments);
app.use('/api/subscribe', subscribe);

app.use(errorHandler);

export default app;

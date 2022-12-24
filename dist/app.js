"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler_1 = __importDefault(require("./errors/errorHandler"));
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var compression = require('compression');
var passport = require('passport');
// route init
const auth_1 = __importDefault(require("./routes/auth"));
const category_1 = __importDefault(require("./routes/category"));
const post_1 = __importDefault(require("./routes/post"));
const index_1 = __importDefault(require("./routes/index"));
const users_1 = __importDefault(require("./routes/users"));
const subscribe_1 = __importDefault(require("./routes/subscribe"));
const comment_1 = __importDefault(require("./routes/comment"));
mongoose
    .connect('mongodb://localhost/freebirth-blog-cms', {})
    .then(() => console.log('connection with DB successful'))
    .catch((err) => console.error(err));
var app = express();
app.use(passport.initialize());
app.use(cors());
app.use(compression({ filter: shouldCompress }));
function shouldCompress(req, res) {
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
app.use('/index', index_1.default);
app.use('/users', users_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/category', category_1.default);
app.use('/api/post', post_1.default);
app.use('/api/comments', comment_1.default);
app.use('/api/subscribe', subscribe_1.default);
app.use(errorHandler_1.default);
exports.default = app;

// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
var passport     = require('passport');
var path         = require('path');

// DB Setup
// mongoose.connect('mongodb://localhost:27017/auth');
require('./config/passport')(passport);
// global.__basedir = path.dirname(__dirname);

// App Setup
app.use(morgan('combined'));
app.use(cors());
// app.use(bodyParser.json({ type: '*/*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

router(app);

// Server Setup
const port = process.env.PORT || 8081;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);


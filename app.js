  const createError = require('http-errors');
  const express = require('express');
  const mongoose = require("mongoose");
  const cors = require("cors");
  const rateLimit = require('express-rate-limit');
  const fs=require("fs");

  const path = require('path');
  const cookieParser = require('cookie-parser');
  const logger = require('morgan');

  const indexRouter = require('./routes/index');
  const usersRouter = require('./routes/users');

  const app = express();
  const mongoDB = async () => {  
    await mongoose.connect("mongodb://localhost:27017/jwttutorial");
  };
   
  mongoDB().catch(error => {
    console.error("Error connecting to database", error);
});

mongoose.connection.on('connected', () => {
  console.log('Connection Established to database');
});

const logFile = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('HTTP Verb: ' + ':method' + '=== URL: ' + ':url' + '=== Status:' + ' :status ' + '\nReq _ Res:' + ':req[header] :res[content-length]' +
  'Res Time: ' + ':response-time ms ', { stream: logFile }));
app.use(logger('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  exposedHeaders: ["Authorization","Link"],
  origin: '*'
}));

const authenticatedLimiter = rateLimit({
  windowMs: 1000,
  max: 10,
  message: 'Too many requests, please try again later.',
});
const nonAuthenticatedLimiter = rateLimit({
  windowMs: 1000,
  max: 5,
  message: 'Too many requests, please try again later.',
});

app.use((req, res, next) => {
  if (req.user) {
    authenticatedLimiter(req, res, next); // Apply authenticated rate limit
  } else {
    nonAuthenticatedLimiter(req, res, next); // Apply non-authenticated rate limit
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


module.exports = app;

const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const requestRouter = require('./routes/request');
const confirmRouter = require('./routes/confirm');
const contractRouter = require('./routes/contract');

const connectionString = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
mongoose.connect(connectionString, { useNewUrlParser: true })
  .then(() => {
    console.log('DB connection successful!')
  }, err => {
    console.log('could not connect to DB!');
  })

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/requests', requestRouter);
app.use('/confirm', confirmRouter);
app.use('/contract', contractRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.message)
});

module.exports = app;

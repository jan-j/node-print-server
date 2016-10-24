var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// app init
var app = express();

// logging dependencies
var morgan = require('morgan');
var FileStreamRotator = require('file-stream-rotator');
var fs = require('fs');

// logging setup
var logDirectory = __dirname + '/log';
var accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYY-MM-DD',
    filename: logDirectory + '/access-%DATE%.log',
    frequency: 'daily',
    verbose: false
});
app.use(morgan('combined', {
    stream: accessLogStream
}));

// request parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// routes configuration
app.use('/', require('./routes/index'));
app.use('/printers', require('./routes/printers'));
app.use('/printer', require('./routes/printer'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            status: 'error',
            message: err.message,
            data: {
                error: err
            }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        status: 'error',
        message: err.message,
        data: {
            error: err
        }
    });
});

module.exports = app;

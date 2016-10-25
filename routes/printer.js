var express = require('express');
var print_util = require('../util/print_util');
var router = express.Router();

// GET printer details
router.get('/:name', function (req, res, next) {
    var name = req.params.name;

    var printer = print_util.getPrinter(name);

    if (printer) {
        res.json({
            status: 'success',
            data: printer
        });
    } else {
        res
            .status(404)
            .json({
                status: 'error',
                message: 'Printer with name "' + name + '" not found.'
            });
    }
});

// GET printer driver options
router.get('/:name/driver-options', function (req, res, next) {
    var name = req.params.name;

    var driverOptions = print_util.getPrinterDriverOptions(name);

    if (driverOptions) {
        res.json({
            status: 'success',
            data: driverOptions
        });
    } else {
        res
            .status(404)
            .json({
                status: 'error',
                message: 'Printer with name "' + name + '" not found.'
            });
    }
});

// GET printer jobs
router.get('/:name/jobs', function (req, res, next) {
    var name = req.params.name;

    var printer = print_util.getPrinter(name);

    if (printer) {
        res.json({
            status: 'success',
            data: printer.jobs
        });
    } else {
        res
            .status(404)
            .json({
                status: 'error',
                message: 'Printer with name "' + name + '" not found.'
            });
    }
});

// GET printer job
router.get('/:name/job/:id', function (req, res, next) {
    var name = req.params.name;
    var id = parseInt(req.params.id);

    var job = print_util.getJob(name, id);

    if (job) {
        res.json({
            status: 'success',
            data: job
        });
    } else {
        res
            .status(404)
            .json({
                status: 'error',
                message: 'Job on printer "' + name + '" with id ' + id + ' not found.'
            });
    }
});

// POST cancel printer job
router.post('/:name/job/:id/cancel', function (req, res, next) {
    var name = req.params.name;
    var id = parseInt(req.params.id);

    var status = print_util.setJob(name, id, 'CANCEL');

    if (status === true) {
        res.json({
            status: 'success',
            message: 'Job on printer "' + name + '" with id ' + id + ' cancelled.'
        });
    } else if (status === null) {
        res
            .status(404)
            .json({
                status: 'error',
                message: 'Job on printer "' + name + '" with id ' + id + ' not found.'
            });
    } else {
        res
            .status(409)
            .json({
                status: 'error',
                message: 'Job on printer "' + name + '" with id ' + id + ' can\'t be cancelled.'
            });
    }
});

module.exports = router;

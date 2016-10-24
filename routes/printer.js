var express = require('express');
var printer_interface = require('printer');
var router = express.Router();

// GET printer details
router.get('/:name', function (req, res, next) {
    var name = req.params.name;

    try {
        var printer = printer_interface.getPrinter(name);
    } catch (e) {
        res
            .status(404)
            .json({
                status: 'error',
                message: 'Printer with name "' + name + '" not found.'
            });
        return;
    }

    if (!printer.jobs) {
        printer.jobs = [];
    }

    res.json({
        status: 'success',
        data: printer
    });
});

// GET printer driver options
router.get('/:name/driver-options', function (req, res, next) {
    var name = req.params.name;

    try {
        var driverOptions = printer_interface.getPrinterDriverOptions(name);
    } catch (e) {
        res
            .status(404)
            .json({
                status: 'error',
                message: 'Printer with name "' + name + '" not found.'
            });
        return;
    }

    res.json({
        status: 'success',
        data: driverOptions
    });
});

// GET printer jobs
router.get('/:name/jobs', function (req, res, next) {
    var name = req.params.name;

    try {
        var printer = printer_interface.getPrinter(name);
        var jobs = printer.jobs || [];
    } catch (e) {
        res
            .status(404)
            .json({
                status: 'error',
                message: 'Printer with name "' + name + '" not found.'
            });
        return;
    }

    res.json({
        status: 'success',
        data: jobs
    });
});

// GET printer job
router.get('/:name/job/:id', function (req, res, next) {
    var name = req.params.name;
    var id = parseInt(req.params.id);

    try {
        var job = printer_interface.getJob(name, id);
    } catch (e) {
        res
            .status(404)
            .json({
                status: 'error',
                message: 'Job on printer "' + name + '" with id ' + id + ' not found.'
            });
        return;
    }

    res.json({
        status: 'success',
        data: job
    });
});

// POST cancel printer job
router.post('/:name/job/:id/cancel', function (req, res, next) {
    var name = req.params.name;
    var id = parseInt(req.params.id);

    try {
        var job = printer_interface.getJob(name, id);
        var status = printer_interface.setJob(name, id, 'CANCEL');
    } catch (e) {
        res
            .status(404)
            .json({
                status: 'error',
                message: 'Job on printer "' + name + '" with id ' + id + ' not found.'
            });
        return;
    }

    if (status) {
        res.json({
            status: 'success',
            message: 'Job on printer "' + name + '" with id ' + id + ' cancelled.'
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

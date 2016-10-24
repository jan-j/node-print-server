var express = require('express');
var printer_interface = require('printer');
var router = express.Router();

// GET printer details
router.get('/:name', function (req, res, next) {
    try {
        var printer = printer_interface.getPrinter(req.params.name);
    } catch (e) {
        res
            .status(404)
            .json({
                status: 'error',
                message: 'Printer with name "' + req.params.name + '" not found.'
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

// GET printer's jobs
router.get('/:name/jobs', function (req, res, next) {
    try {
        var printer = printer_interface.getPrinter(req.params.name);
        var jobs = printer.jobs || [];
    } catch (e) {
        res
            .status(404)
            .json({
                status: 'error',
                message: 'Printer with name "' + req.params.name + '" not found.'
            });
        return;
    }

    res.json({
        status: 'success',
        data: jobs
    });
});

// GET printer's driver options
router.get('/:name/driver-options', function (req, res, next) {
    try {
        var driverOptions = printer_interface.getPrinterDriverOptions(req.params.name);
    } catch (e) {
        res
            .status(404)
            .json({
                status: 'error',
                message: 'Printer with name "' + req.params.name + '" not found.'
            });
        return;
    }

    res.json({
        status: 'success',
        data: driverOptions
    });
});

module.exports = router;

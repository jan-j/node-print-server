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

module.exports = router;

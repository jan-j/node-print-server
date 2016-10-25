var express = require('express');
var print_util = require('../util/print_util');
var router = express.Router();

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

module.exports = router;

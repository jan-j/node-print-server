var express = require('express');
var print_util = require('../util/print_util');
var router = express.Router();

// GET printers listing
router.get('/', function (req, res, next) {
    var printers = print_util.getPrinters();

    res.json({
        status: 'success',
        data: printers
    });
});

module.exports = router;

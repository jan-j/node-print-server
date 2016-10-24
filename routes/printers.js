var express = require('express');
var printer_interface = require('printer');
var router = express.Router();

// GET printers listing
router.get('/', function (req, res, next) {
    var printers = printer_interface.getPrinters();
    res.json({
        status: 'success',
        data: printers
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();

// GET print server status
router.get('/', function (req, res, next) {
    res.json({
        status: 'success',
        data: {},
        message: 'Print server is running.'
    });
});

module.exports = router;

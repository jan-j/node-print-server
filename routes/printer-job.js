var express = require('express');
var print_util = require('../util/print_util');
var router = express.Router();


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

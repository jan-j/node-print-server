var express = require('express');
var print_util = require('../util/print_util');
var router = express.Router();

// POST print file
router.post('/:name/print', function (req, res, next) {
    var name = req.params.name;

    var printer = print_util.getPrinter(name);

    if (!printer) {
        res
            .status(404)
            .json({
                status: 'error',
                message: 'Printer with name "' + name + '" not found.'
            });
        return;
    }

    if (req.body.content) {
        print_util.printFromBase64(
            name,
            req.body.content,
            function successCallback(jobId) {
                res
                    .json({
                        status: 'success',
                        data: print_util.getJob(name, jobId)
                    });
            },
            function errorCallback(err) {
                res
                    .status(400)
                    .json({
                        status: 'error',
                        message: 'File printing on printer "' + name + '" has failed.'
                    });
            }
        );
    } else if (req.body.url) {
        print_util.printFromUrl(
            name,
            req.body.url,
            function successCallback(jobId) {
                res
                    .json({
                        status: 'success',
                        data: print_util.getJob(name, jobId)
                    });
            },
            function errorCallback(err) {
                res
                    .status(400)
                    .json({
                        status: 'error',
                        message: 'File printing on printer "' + name + '" has failed.'
                    });
            }
        );
    } else {
        res
            .status(400)
            .json({
                status: 'error',
                message: 'File for printing not provided.'
            });
    }
});

module.exports = router;

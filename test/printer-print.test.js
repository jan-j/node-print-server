var fs = require('fs');
var request = require('supertest');
var printerStub = require('./stubs/printer.stub');
var proxyquire = require('proxyquire');

var imageFile = fs.readFileSync(__dirname + '/assets/dot.jpg');
var imageFileBase64 = imageFile.toString('base64');
fs.writeFileSync(__dirname + '/assets/dot.txt', imageFileBase64);

describe('/printer/:name/print endpoint', function () {
    var server;

    proxyquire('../util/print_util', {
        printer: printerStub
    });

    beforeEach(function () {
        delete require.cache[require.resolve('../bin/www')];
        server = require('../bin/www');
    });

    afterEach(function (done) {
        server.close(done);
    });

    it('POST /printer/Brother_DCP_7055W/print - print base64 file - success', function (done) {
        printerStub.printer = printerStub._printerResponse;
        printerStub.printJobId = printerStub._printerResponse.jobs[0].id;

        request(server)
            .post('/printer/Brother_DCP_7055W/print')
            .send({
                content: imageFileBase64
            })
            .expect({
                status: 'success',
                data: printerStub._printerResponse.jobs[0]
            })
            .end(done);
    });

    it('POST /printer/Brother_DCP_7055W/print - printer not found', function (done) {
        printerStub.printer = null;
        printerStub.printJobId = printerStub._printerResponse.jobs[0].id;

        request(server)
            .post('/printer/Brother_DCP_7055W/print')
            .send({
                content: imageFileBase64
            })
            .expect(404, {
                status: 'error',
                message: 'Printer with name "Brother_DCP_7055W" not found.'
            })
            .end(done);
    });

    it('POST /printer/Brother_DCP_7055W/print - file not provided', function (done) {
        printerStub.printer = printerStub._printerResponse;
        printerStub.printJobId = printerStub._printerResponse.jobs[0].id;

        request(server)
            .post('/printer/Brother_DCP_7055W/print')
            .expect(400, {
                status: 'error',
                message: 'File for printing not provided.'
            })
            .end(done);
    });

    it('POST /printer/Brother_DCP_7055W/print - print failure', function (done) {
        printerStub.printer = printerStub._printerResponse;
        printerStub.printJobId = null;

        request(server)
            .post('/printer/Brother_DCP_7055W/print')
            .send({
                content: imageFileBase64
            })
            .expect(400, {
                status: 'error',
                message: 'File printing on printer "Brother_DCP_7055W" has failed.'
            })
            .end(done);
    });
});

var request = require('supertest');
var printerStub = require('./stubs/printer.stub');
var proxyquire = require('proxyquire');

describe('/printer/:name endpoint', function () {
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

    it('GET /printer - 404 not found', function (done) {
        request(server)
            .get('/printer')
            .expect(404)
            .end(done);
    });

    it('GET /printer/NON_EXISTENT_PRINTER - 404 not found', function (done) {
        printerStub.printer = null;

        request(server)
            .get('/printer/NON_EXISTENT_PRINTER')
            .expect(404, {
                status: 'error',
                message: 'Printer with name "NON_EXISTENT_PRINTER" not found.'
            })
            .end(done);
    });

    it('GET /printer/Brother_DCP_7055W - printer found with 1 job in progress', function (done) {
        printerStub.printer = printerStub._printerResponse;

        request(server)
            .get('/printer/Brother_DCP_7055W')
            .expect(200, {
                status: 'success',
                data: printerStub.printer
            })
            .end(done);
    });

    it('GET /printer/Brother_DCP_7055W - printer found with 0 jobs', function (done) {
        printerStub.printer = Object.assign({}, printerStub._printerResponse);
        delete printerStub.printer.jobs;

        request(server)
            .get('/printer/Brother_DCP_7055W')
            .expect(200, {
                status: 'success',
                data: Object.assign({}, printerStub._printerResponse, {
                    jobs: []
                })
            })
            .end(done);
    });

    it('GET /printer/Brother_DCP_7055W/driver-options - printer driver options', function (done) {
        printerStub.printerDriverOptions = printerStub._printerDriverOptionsResponse;

        request(server)
            .get('/printer/Brother_DCP_7055W/driver-options')
            .expect(200, {
                status: 'success',
                data: printerStub.printerDriverOptions
            })
            .end(done);
    });
});

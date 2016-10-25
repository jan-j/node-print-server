var request = require('supertest');
var printerStub = require('./stubs/printer.stub');
var proxyquire = require('proxyquire');

describe('/printer/:name/jobs endpoint', function () {
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

    it('GET /printer/Brother_DCP_7055W/jobs - found 1 job in progress', function (done) {
        printerStub.printer = printerStub._printerResponse;

        request(server)
            .get('/printer/Brother_DCP_7055W/jobs')
            .expect(200, {
                status: 'success',
                data: printerStub.printer.jobs
            })
            .end(done);
    });
});

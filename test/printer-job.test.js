var request = require('supertest');
var printerStub = require('./stubs/printer.stub');
var proxyquire = require('proxyquire');

describe('/printer/:name/job/:id endpoint', function () {
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

    it('GET /printer/Brother_DCP_7055W/job/2 - 404 not found', function (done) {
        printerStub.job = null;

        request(server)
            .get('/printer/Brother_DCP_7055W/job/2')
            .expect(404, {
                status: 'error',
                message: 'Job on printer "Brother_DCP_7055W" with id 2 not found.'
            })
            .end(done);
    });

    it('GET /printer/Brother_DCP_7055W/job/1 - job in progress', function (done) {
        printerStub.job = printerStub._printerResponse.jobs[0];

        request(server)
            .get('/printer/Brother_DCP_7055W/job/1')
            .expect(200, {
                status: 'success',
                data: printerStub.job
            })
            .end(done);
    });

    it('POST /printer/Brother_DCP_7055W/job/2/cancel - 404 not found', function (done) {
        printerStub.job = null;

        request(server)
            .post('/printer/Brother_DCP_7055W/job/2/cancel')
            .expect(404, {
                status: 'error',
                message: 'Job on printer "Brother_DCP_7055W" with id 2 not found.'
            })
            .end(done);
    });

    it('POST /printer/Brother_DCP_7055W/job/1/cancel - conflict', function (done) {
        printerStub.job = printerStub._printerResponse.jobs[0];
        printerStub.jobCancel = false;

        request(server)
            .post('/printer/Brother_DCP_7055W/job/1/cancel')
            .expect(409, {
                status: 'error',
                message: 'Job on printer "Brother_DCP_7055W" with id 1 can\'t be cancelled.'
            })
            .end(done);
    });

    it('POST /printer/Brother_DCP_7055W/job/1/cancel - successful', function (done) {
        printerStub.job = printerStub._printerResponse.jobs[0];
        printerStub.jobCancel = true;

        request(server)
            .post('/printer/Brother_DCP_7055W/job/1/cancel')
            .expect(200, {
                status: 'success',
                message: 'Job on printer "Brother_DCP_7055W" with id 1 cancelled.'
            })
            .end(done);
    });
});

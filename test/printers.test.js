var request = require('supertest');
var printerStub = require('./stubs/printer.stub');
var proxyquire = require('proxyquire');

describe('printers endpoint', function () {
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

    it('GET /printers - return empty array', function (done) {
        printerStub.printers = [];

        request(server)
            .get('/printers')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                status: 'success',
                data: []
            })
            .end(done);
    });

    it('GET /printers - returns array of printers', function (done) {
        printerStub.printers = printerStub._printersResponse;

        request(server)
            .get('/printers')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                status: 'success',
                data: printerStub.printers
            })
            .end(done);
    });
});

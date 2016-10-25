var request = require('supertest');
var printerStub = require('./stubs/printer.stub');
var proxyquire = require('proxyquire');

describe('printers endpoint', function () {
    var server;

    var printersResponse = [
        {
            isDefault: false,
            name: 'Brother_DCP_7055W',
            options: {
                copies: '1',
                'device-uri': 'dnssd://Brother%20DCP-7055W._pdl-datastream._tcp.local./?bidi'
            },
            status: 'IDLE'
        },
        {
            isDefault: true,
            name: 'MITSUBISHI_CPD80D',
            options: {
                copies: '1',
                'device-uri': 'usb://MITSUBISHI/CPD80D?serial=CPD80D104089'
            },
            status: 'IDLE'
        }
    ];

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
        printerStub.printers = printersResponse;

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

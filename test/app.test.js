var request = require('supertest');
var chai = require('chai');
var assert = chai.assert;
var proxyquire = require('proxyquire');

describe('print server', function () {
    var server;

    var printers;

    proxyquire('../routes/printers.js', {
        printer: {
            getPrinters: function () {
                return printers;
            }
        }
    });

    beforeEach(function () {
        delete require.cache[require.resolve('../bin/www')];
        server = require('../bin/www');
    });

    afterEach(function (done) {
        server.close(done);
    });

    describe('various endpoints', function () {
        it('responds with server status to /', function testRootPath(done) {
            request(server)
                .get('/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, {
                    status: 'success',
                    data: {},
                    message: 'Print server is running'
                })
                .end(done);
        });

        it('404 everything else', function testInvalidPath(done) {
            request(server)
                .get('/foo/bar')
                .expect(404)
                .end(done);
        });
    });

    describe('printers endpoint', function () {
        it('responds to /printers with empty array', function testNoPrinters(done) {
            printers = [];

            request(server)
                .get('/printers')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, {
                    status: 'success',
                    data: {
                        printers: []
                    }
                })
                .end(done);
        });

        it('responds to /printers with array of printers', function testSomePrinters(done) {
            printers = [
                {
                    isDefault: false,
                    name: 'Brother_DCP_7055W',
                    options: {
                        copies: 1,
                        'device-uri': 'dnssd://Brother%20DCP-7055W._pdl-datastream._tcp.local./?bidi'
                    },
                    status: 'IDLE'
                },
                {
                    isDefault: true,
                    name: 'MITSUBISHI_CPD80D',
                    options: {
                        copies: 1,
                        'device-uri': 'usb://MITSUBISHI/CPD80D?serial=CPD80D104089'
                    },
                    status: 'IDLE'
                }
            ];

            request(server)
                .get('/printers')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .expect(200, {
                    status: 'success',
                    data: {
                        printers: printers
                    }
                })
                .end(done);
        });
    });

});

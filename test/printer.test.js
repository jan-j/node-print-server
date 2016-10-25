var request = require('supertest');
var printerStub = require('./stubs/printer.stub');
var proxyquire = require('proxyquire');

describe('printer endpoint', function () {
    var server;

    var printerResponse = {
        isDefault: false,
        jobs: [
            {
                completedTime: '1970-01-01T00:00:00.000Z',
                creationTime: '2016-10-24T12:53:28.000Z',
                format: 'PDF',
                id: 1,
                name: 'image.jpg',
                printerName: 'Brother_DCP_7055W',
                priority: 50,
                processingTime: '2016-10-24T12:53:28.000Z',
                size: 1067,
                status: ['PRINTING'],
                user: 'john'
            }
        ],
        name: 'Brother_DCP_7055W',
        options: {
            copies: '1',
            'device-uri': 'dnssd://Brother%20DCP-7055W._pdl-datastream._tcp.local./?bidi'
        },
        status: 'IDLE'
    };

    var printerDriverOptionsResponse = {
        BRHalfTonePattern: {
            Brother: true,
            Brother4: false,
        },
        PageSize: {
            '3x5': false,
            'A4': false,
            'A5': false,
            'A5Rotated': false,
            'A6': false,
            'B5': false,
            'Letter': true,
            'Postcard': false,
        },
        TonerSaveMode: {
            OFF: true,
            ON: false,
        }
    };

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
        request(server)
            .get('/printer/NON_EXISTENT_PRINTER')
            .expect(404, {
                status: 'error',
                message: 'Printer with name "NON_EXISTENT_PRINTER" not found.'
            })
            .end(done);
    });

    it('GET /printer/Brother_DCP_7055W - printer found with 1 job in progress', function (done) {
        printerStub.printer = printerResponse;

        request(server)
            .get('/printer/Brother_DCP_7055W')
            .expect(200, {
                status: 'success',
                data: printerStub.printer
            })
            .end(done);
    });

    it('GET /printer/Brother_DCP_7055W - printer found with 0 jobs', function (done) {
        printerStub.printer = Object.assign({}, printerResponse);
        delete printerStub.printer.jobs;

        request(server)
            .get('/printer/Brother_DCP_7055W')
            .expect(200, {
                status: 'success',
                data: Object.assign({}, printerResponse, {
                    jobs: []
                })
            })
            .end(done);
    });

    it('GET /printer/Brother_DCP_7055W/driver-options - printer driver options', function (done) {
        printerStub.printerDriverOptions = printerDriverOptionsResponse;

        request(server)
            .get('/printer/Brother_DCP_7055W/driver-options')
            .expect(200, {
                status: 'success',
                data: printerStub.printerDriverOptions
            })
            .end(done);
    });

    it('GET /printer/Brother_DCP_7055W/jobs - found 1 job in progress', function (done) {
        printerStub.printer = printerResponse;

        request(server)
            .get('/printer/Brother_DCP_7055W/jobs')
            .expect(200, {
                status: 'success',
                data: printerStub.printer.jobs
            })
            .end(done);
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
        printerStub.job = printerResponse.jobs[0];

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
        printerStub.job = printerResponse.jobs[0];
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
        printerStub.job = printerResponse.jobs[0];
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

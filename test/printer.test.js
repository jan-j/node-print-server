var request = require('supertest');
var proxyquire = require('proxyquire');

describe('printer endpoint', function () {
    var server;

    var printerStub = {
        printer: null,
        printerDriverOptions: null,
        getPrinter: function (name) {
            if (!this.printer) {
                throw new TypeError('Printer not found');
            } else {
                return this.printer;
            }
        },
        getPrinterDriverOptions: function (name) {
            if (!this.printerDriverOptions) {
                throw new TypeError('Printer not found');
            } else {
                return this.printerDriverOptions;
            }
        }
    };

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

    proxyquire('../routes/printer.js', {
        printer: printerStub

    });

    beforeEach(function () {
        delete require.cache[require.resolve('../bin/www')];
        server = require('../bin/www');
    });

    afterEach(function (done) {
        server.close(done);
    });

    it('GET /printer - 404 not found', function testPrinterWithoutSpecifyingName(done) {
        request(server)
            .get('/printer')
            .expect(404)
            .end(done);
    });

    it('GET /printer/NON_EXISTENT_PRINTER - 404 not found', function testPrinterWithInvalidName(done) {
        request(server)
            .get('/printer/NON_EXISTENT_PRINTER')
            .expect(404, {
                status: 'error',
                message: 'Printer with name "NON_EXISTENT_PRINTER" not found.'
            })
            .end(done);
    });

    it('GET /printer/Brother_DCP_7055W - printer found with 1 job in progress', function testPrinterWithOneJobInProgress(done) {
        printerStub.printer = printerResponse;

        request(server)
            .get('/printer/Brother_DCP_7055W')
            .expect(200, {
                status: 'success',
                data: printerStub.printer
            })
            .end(done);
    });

    it('GET /printer/Brother_DCP_7055W - printer found with 0 jobs', function testPrinterWithZeroJobs(done) {
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

    it('GET /printer/Brother_DCP_7055W/jobs - found 1 job in progress', function testPrinterJobs(done) {
        printerStub.printer = printerResponse;

        request(server)
            .get('/printer/Brother_DCP_7055W/jobs')
            .expect(200, {
                status: 'success',
                data: printerStub.printer.jobs
            })
            .end(done);
    });

    it('GET /printer/Brother_DCP_7055W/driver-options - printer driver options', function testPrinterDriverOptions(done) {
        printerStub.printerDriverOptions = printerDriverOptionsResponse;

        request(server)
            .get('/printer/Brother_DCP_7055W/driver-options')
            .expect(200, {
                status: 'success',
                data: printerStub.printerDriverOptions
            })
            .end(done);
    });

});

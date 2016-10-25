var printerStub = {
    printer: null,
    printers: [],
    printerDriverOptions: null,
    job: null,
    jobCancel: false,

    printJobId: null,

    _printersResponse: [
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
    ],

    _printerResponse: {
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
    },

    _printerDriverOptionsResponse: {
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
    },

    getPrinters: function () {
        return this.printers;
    },

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
    },

    getJob: function (name, id) {
        if (!this.job) {
            throw new TypeError('Printer job not found');
        } else {
            return this.job;
        }
    },

    setJob: function (name, id, command) {
        if (!this.job) {
            throw new TypeError('Printer job not found');
        } else {
            return this.jobCancel;
        }
    },

    printDirect: function (params) {
        if (this.printJobId) {
            params.success(this.printJobId);
        } else {
            params.error(new TypeError('Print error'));
        }
    }
};

module.exports = printerStub;
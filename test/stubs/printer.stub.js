var printerStub = {
    printer: null,
    printers: [],
    printerDriverOptions: null,
    job: null,
    jobCancel: false,

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
    }
};

module.exports = printerStub;
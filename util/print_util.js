var printer_interface = require('printer');
var print_util = {};

/**
 * @returns {{}[]}
 */
print_util.getPrinters = function () {
    return printer_interface.getPrinters();
};

/**
 * @param {string} name
 * @returns {{}|null}
 */
print_util.getPrinter = function (name) {
    try {
        var printer = printer_interface.getPrinter(name);
    } catch (e) {
        return null;
    }

    if (!printer.jobs) {
        printer.jobs = [];
    }

    return printer;
};

/**
 * @param {string} name
 * @returns {{}|null}
 */
print_util.getPrinterDriverOptions = function (name) {
    try {
        var driverOptions = printer_interface.getPrinterDriverOptions(name);
    } catch (e) {
        return null;
    }

    return driverOptions;
};

/**
 * @param {string} name
 * @param {int} id
 * @returns {{}|null}
 */
print_util.getJob = function (name, id) {
    try {
        var job = printer_interface.getJob(name, id);
    } catch (e) {
        return null;
    }

    return job;
};

/**
 * @param {string} name
 * @param {int} id
 * @param {string} command
 * @returns {boolean|null}
 */
print_util.setJob = function (name, id, command) {
    try {
        var job = printer_interface.getJob(name, id);
    } catch (e) {
        return null;
    }

    if(job.status.indexOf('PRINTED') !== -1) {
        return false;
    }

    try {
        var status = printer_interface.setJob(name, id, 'CANCEL');
    } catch (e) {
        return false;
    }

    return status === true;
};

/**
 * @param {string} name
 * @param {string} base64Content
 * @param {function} success
 * @param {function} error
 * @returns {int}
 */
print_util.printBase64File = function (name, base64Content, success, error) {
    try {
        printer_interface.printDirect({
            printer: name,
            data: Buffer.from(base64Content, 'base64'),
            success: success,
            error: error
        });
    } catch (e) {
        error(e.message);
    }
};

module.exports = print_util;

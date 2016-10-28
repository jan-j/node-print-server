var printer_interface = require('printer');
var request = require('request');
var debug = require('debug')('error');
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
        debug('Exception thrown while calling printer.getPrinter(' + name + ')', e);
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
        debug('Exception thrown while calling printer.getPrinterDriverOptions(' + name + ')', e);
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
        debug('Exception thrown while calling printer.getJob(' + [name, id].join(', ') + ')', e);
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
    var job = print_util.getJob(name, id);

    if (!job) {
        return null;
    }

    if(job.status.indexOf('PRINTED') !== -1) {
        return false;
    }

    try {
        var status = printer_interface.setJob(name, id, command);
    } catch (e) {
        debug('Exception thrown while calling printer.setJob(' + [name, id, command].join(', ') + ')', e);
        return false;
    }

    return status === true;
};

/**
 * @param {string} name
 * @param {string} content
 * @param {function} success
 * @param {function} error
 * @returns {int}
 */
print_util.printDirect = function (name, content, success, error) {
    try {
        printer_interface.printDirect({
            printer: name,
            data: content,
            type: print_util.PRINT_FORMATS.AUTO,
            options: {
                'fit-to-page': true
            },
            success: success,
            error: error
        });
    } catch (e) {
        debug('Exception thrown while calling printer.printDirect(' + [name, '...'].join(', ') + ')', e);
        error(e.message);
    }
};

/**
 * @param {string} name
 * @param {string} base64Content
 * @param {function} success
 * @param {function} error
 * @returns {int}
 */
print_util.printFromBase64 = function (name, base64Content, success, error) {
    print_util.printDirect(name, Buffer.from(base64Content, 'base64'), success, error);
};

/**
 * @param {string} name
 * @param {string} url
 * @param {function} success
 * @param {function} error
 * @returns {int}
 */
print_util.printFromUrl = function (name, url, success, error) {
    request.get(url, function (err, response, body) {
        if (err) {
            error(err);
            return;
        } else if (parseInt(response.statusCode) < 200 || parseInt(response.statusCode) >= 300) {
            debug('Error: File at "' + url + '" responded with ' + response.statusCode + ' status code');
            error('File at "' + url + '" responded with ' + response.statusCode + ' status code');
            return;
        }

        print_util.printDirect(name, body, success, error);
    });
};

print_util.PRINT_FORMATS = {
    AUTO: 'AUTO',
    COMMAND: 'COMMAND',
    JPEG: 'JPEG',
    PDF: 'PDF',
    POSTSCRIPT: 'POSTSCRIPT',
    RAW: 'RAW',
    TEXT: 'TEXT'
};

module.exports = print_util;

var request = require('supertest');

describe('general app endpoints', function () {
    var server;

    beforeEach(function () {
        delete require.cache[require.resolve('../bin/www')];
        server = require('../bin/www');
    });

    afterEach(function (done) {
        server.close(done);
    });

    it('GET / - server status', function testRootPath(done) {
        request(server)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, {
                status: 'success',
                data: {},
                message: 'Print server is running.'
            })
            .end(done);
    });

    it('GET /foo/bar - 404 on undefined route', function testInvalidPath(done) {
        request(server)
            .get('/foo/bar')
            .expect(404)
            .end(done);
    });
});

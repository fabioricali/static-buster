const statiBuster = require('../');

describe('static-buster', function () {
    it('should be return true', function () {
        new statiBuster({
            files: [
                './test/texture/index1.html'
            ]
        });
    });
});
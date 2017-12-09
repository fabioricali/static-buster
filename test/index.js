const staticBuster = require('../');
const fs = require('fs-extra');
const cheerio = require('cheerio');
const dataUtils = require('../src/data-utils');
const queryString = require('querystring');
const URL = require('url');
const be = require('bejs');

const REF = {
    script: 'src',
    link: 'href'
};

describe('static-buster', function () {
    beforeEach(function () {
        fs.removeSync('./test/texture/index1.html');
        fs.removeSync('./test/texture/index1.html-copy');
        fs.copySync('./test/texture/index1.html-origin', './test/texture/index1.html');

        /*
        fs.removeSync('./test/texture/index2.html');
        fs.removeSync('./test/texture/index2.html-copy');
        fs.copySync('./test/texture/index2.html-origin', './test/texture/index2.html');
        */
    });

    it('should be ok', function (done) {
        new staticBuster({
            files: [
                './test/texture/index1.html'
            ],
            busterValue: '0.0.0'
        }).then(() => {
            return dataUtils.readFile('./test/texture/index1.html');
        }).then((data) => {
            $ = cheerio.load(data);
            $('link,script').each((i, el) => {
                let query = URL.parse(el.attribs[REF[el.name]]).query;
                let params = queryString.parse(query);
                be.err.equal(params['_sb'], '0.0.0');
            });
            done();
        }).catch(err => {
            done(err);
        })
    });

});
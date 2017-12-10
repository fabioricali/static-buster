const fs = require('fs-extra');
const cheerio = require('cheerio');
const queryString = require('querystring');
const URL = require('url');
const be = require('bejs');
const util = require('util');
const staticBuster = util.promisify(require('child_process').exec);

const REF = {
    script: 'src',
    link: 'href'
};

describe('staticbuster cli', function () {
    beforeEach(function () {
        fs.removeSync('./test/fixtures/index1.html');
        fs.removeSync('./test/fixtures/index1.html-copy');
        fs.removeSync('./test/fixtures/index1-other.html');
        fs.copySync('./test/fixtures/index1.html-origin', './test/fixtures/index1.html');
    });

    it('should be ok', function (done) {
        staticBuster('node src/cli.js -f ./test/fixtures/index1.html -v 1.0.0').then((p) => {
            if(!p.stderr)
                return fs.readFile('./test/fixtures/index1.html');
            else
                done(p.stderr);
        }).then((data) => {
            $ = cheerio.load(data);
            $('link,script').each((i, el) => {
                let query = URL.parse(el.attribs[REF[el.name]]).query;
                let params = queryString.parse(query);
                be.err.equal(params['_sb'], '1.0.0');
            });
            done();
        }).catch(err => {
            done(err);
        })
    });

    it('should be return error, file not found', function (done) {
        staticBuster('node src/cli.js -f ./test/fixtures/not_found.html').then((p) => {
            if(p.stderr)
                done();
            else
                done('error');
        })
    });

    it('should be ok, set destination', function (done) {
        staticBuster('node src/cli.js -f ./test/fixtures/index1.html -d ./test/fixtures/index1-other.html -v 1.0.0').then(() => {
            return fs.readFile('./test/fixtures/index1-other.html');
        }).then((data) => {
            $ = cheerio.load(data);
            $('link,script').each((i, el) => {
                let query = URL.parse(el.attribs[REF[el.name]]).query;
                let params = queryString.parse(query);
                be.err.equal(params['_sb'], '1.0.0');
            });
            done();
        }).catch(err => {
            done(err);
        })
    });

    it('should be ok, disable save copy', function (done) {
        staticBuster('node src/cli.js -f ./test/fixtures/index1.html -b false').then(() => {
            return fs.pathExists('./test/fixtures/index1.html-copy');
        }).then((result) => {
            if(!result)
                done();
            else
                done('error');
        }).catch(err => {
            done(err);
        })
    });
});
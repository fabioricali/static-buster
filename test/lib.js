const staticBuster = require('../');
const fs = require('fs-extra');
const cheerio = require('cheerio');
const queryString = require('querystring');
const URL = require('url');
const be = require('bejs');

const REF = {
    script: 'src',
    link: 'href'
};

describe('staticbuster', function () {
    beforeEach(function () {
        fs.removeSync('./test/fixtures/index1.html');
        fs.removeSync('./test/fixtures/index1.html-copy');
        fs.removeSync('./test/fixtures/other/index1.html');
        fs.copySync('./test/fixtures/index1.html-origin', './test/fixtures/index1.html');
    });

    it('should be ok', function (done) {
        staticBuster({
            file: './test/fixtures/index1.html',
            busterValue: '0.0.0'
        }).then(() => {
            return fs.readFile('./test/fixtures/index1.html');
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

    it('should be return error, file not found', function (done) {
        staticBuster({
            file: './test/fixtures/not_found.html'
        }).then(() => {
            done('error');
        }).catch(() => {
            done();
        })
    });

    it('should be ok, set destination', function (done) {
        staticBuster({
            file: './test/fixtures/index1.html',
            dest: './test/fixtures/other/index1.html',
            busterValue: '1.0.0'
        }).then(() => {
            return fs.readFile('./test/fixtures/other/index1.html');
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
        staticBuster({
            file: './test/fixtures/index1.html',
            saveCopy: false
        }).then(() => {
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
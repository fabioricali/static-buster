const cheerio = require('cheerio');
const fs = require('fs');
const extend = require('defaulty');
const URL = require('url');
const queryString = require('querystring');
const dataUtils = require('./data-utils');

class StaticBuster{

    constructor(opts = {}) {

        this.opts = extend.copy(opts, {
            files: [],
            busterValue: (new Date()).getTime(),
            busterParam: '_sb',
            saveCopy: true
        });

        this.REF = {
            script: 'src',
            link: 'href'
        };

        return this.run();
    }

    async run() {

        for(let file of this.opts.files){
            let content = await dataUtils.readFile(file);

            if(this.opts.saveCopy)
                await dataUtils.writeFile(file + '-copy', content);

            this.$ = cheerio.load(content);

            this.$('link,script').each((i, el)=>{
                this.applyCacheBuster(el, this.REF[el.name]);
            });

            await dataUtils.writeFile(file, this.$.html());
        }

    }

    applyCacheBuster(el, attr) {

        if (this.$ === undefined) return;

        el = this.$(el);

        let prevValue = el.attr(attr);

        const myURL = URL.parse(prevValue);
        const query = myURL.query;

        let bustedUrl = '';

        if(myURL.protocol)
            // remote
            bustedUrl = `${myURL.protocol}//${myURL.host}${myURL.pathname}`;
        else
            // local
            bustedUrl = `${myURL.pathname}`;

        if(query) {
            let params = queryString.parse(query);
            params[this.opts.busterParam] = this.opts.busterValue;
            bustedUrl += `?${queryString.stringify(params)}`;
        } else {
            bustedUrl += `?${this.opts.busterParam}=${this.opts.busterValue}`;
        }

        el.attr(attr, bustedUrl);
    }

}

module.exports = StaticBuster;
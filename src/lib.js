const cheerio = require('cheerio');
const fs = require('fs-extra');
const extend = require('defaulty');
const URL = require('url');
const queryString = require('querystring');
const arrayme = require('arrayme');
const path = require('path');

class StaticBuster{

    constructor(opts = {}) {

        this.opts = extend.copy(opts, {
            file: [],
            dest: '',
            busterValue: (new Date()).getTime(),
            busterParam: '_sb',
            saveCopy: true
        });

        this.opts.file = arrayme(this.opts.file);

        this.REF = {
            script: 'src',
            link: 'href'
        };

        return this.run();
    }

    async run() {

        for(let file of this.opts.file){
            let content = await fs.readFile(file);

            if(this.opts.saveCopy)
                await fs.writeFile(file + '-copy', content);

            this.$ = cheerio.load(content);

            this.$('link,script').each((i, el)=>{
                this.applyCacheBuster(el, this.REF[el.name]);
            });

            if(this.opts.dest) {
                file = this.opts.dest;
                let dirname = path.dirname(file);
                let basename = path.basename(file);
                await fs.ensureDir(dirname);
                file = dirname + '/' + basename;
            }

            await fs.writeFile(file, this.$.html());
        }

        return Promise.resolve(this.opts.file);
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

module.exports = (opts) => {
    return new StaticBuster(opts);
};
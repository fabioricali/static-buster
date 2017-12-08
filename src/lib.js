const cheerio = require('cheerio');
const fs = require('fs');
const extend = require('defaulty');
const URL = require('url');

class StaticBuster{

    constructor(opts = {}) {

        this.opts = extend.copy(opts, {
            files: [],
            busterValue: (new Date()).getTime(),
            busterParam: '_sb',
        });

        this.opts.files.forEach((file)=>{
            let content = fs.readFileSync(file).toString();
            this.$ = cheerio.load(content);

            this.$('link').each((i, el)=>{
                this.applyCacheBuster(el, 'href');
            });

            this.$('script').each((i, el)=>{
                this.applyCacheBuster(el, 'src');
            });

            console.log(this.$.html())
        })
    }

    applyCacheBuster(el, attr) {
        el = this.$(el);

        let prevValue = el.attr(attr);

        //const myURL = URL.parse(prevValue);
        //console.log(myURL);

        let symbol = prevValue.indexOf('?') !== -1 ? '&' : '?';

        el.attr(attr, `${prevValue}${symbol}${this.opts.busterParam}=${this.opts.busterValue}`);
    }

}

module.exports = StaticBuster;
const cheerio = require('cheerio');
const fs = require('fs');
const extend = require('defaulty');

class StaticBuster{
    constructor(opts = {}) {
        this.opts = extend.copy(opts, {
            files: [],
            cacheBuster: (new Date()).getTime()
        });
    }

    run(){
        this.opts.files.forEach((file)=>{
            let content = fs.readFileSync(file).toString();
            let $ = cheerio.load(content);

            $('link').each((i, el)=>{
                let href = $(el).attr('href');
                $(el).attr('href', href + '?' + this.opts.cacheBuster);
            });

            $('script').each((i, el)=>{
                let src = $(el).attr('src');
                $(el).attr('src', src + '?' + this.opts.cacheBuster);
            });

            console.log($.html())
        })
    }
}

module.exports = StaticBuster;
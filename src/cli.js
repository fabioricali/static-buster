#!/usr/bin/env node
const program = require('commander');
const lib = require('./lib');
const {version} = require('../package');

program
    .version(version)
    .option('-f, --file <fileName>', 'file to process')
    .option('-d, --dest [destination]', 'optional file destination')
    .option('-b, --savecopy [boolean]', 'optional save a copy')
    .option('-p, --busterParam [value]', 'optional buster param, for default is _sb')
    .option('-v, --busterValue [value]', 'optional buster value, for default is the timestamp')
    .parse(process.argv)
;

lib({
    file: program.file,
    dest: program.dest,
    saveCopy: Boolean(program.savecopy)
}).then(() => console.log('ok')).catch(err => console.log(err));
#!/usr/bin/env node
const program = require('commander');
const lib = require('./lib');
const {version} = require('../package');

program
    .version(version)
    .option('-f, --file <fileName>', 'file to process')
    .option('-d, --dest [destination]', 'optional file destination')
    .option('-b, --saveCopy [boolean]', 'optional save a copy')
    .option('-p, --busterParam [param]', 'optional buster param, for default is _sb')
    .option('-v, --busterValue [value]', 'optional buster value, for default is the timestamp')
    .parse(process.argv)
;

lib({
    file: program.file,
    dest: program.dest,
    saveCopy: Boolean(program.saveCopy),
    busterParam: program.busterParam,
    busterValue: program.busterValue
}).then((f) => console.log('processed:', f)).catch(err => console.err(err));
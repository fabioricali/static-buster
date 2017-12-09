const fs = require('fs');

module.exports = {
    readFile(fileName) {
        return new Promise(function (resolve, reject) {
            fs.readFile(fileName, (err, data) => {
                err ? reject(err) : resolve(data);
            });
        });
    },

    writeFile(fileName, data) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(fileName, data, (err) => {
                err ? reject(err) : resolve();
            });
        });
    }
};
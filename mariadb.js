const mariadb = require('mysql2');

const connection = mariadb.createConnection({
    host : '127.0.0.1',
    user : 'root',
    password : 'thdud852^^',
    database : 'Bookshop',
    dataString : true
});

module.exports = connection;
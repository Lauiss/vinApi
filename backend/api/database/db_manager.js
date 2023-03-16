"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbManager = void 0;
let mysql = require('mysql');
class dbManager {
    constructor(dbname, dbuname, dbpwd) {
        this.db_name = dbname;
        this.db_connection = mysql.createConnection({
            host: '127.0.0.1',
            user: dbuname,
            password: dbpwd,
            database: dbname
        });
    }
    createDb(connection = this.db_connection, dbname = this.db_name) {
        connection.query(`CREATE DATABASE ${dbname}`, function (e) {
            if (e)
                throw e;
            console.log("Base de données créée avec succès.");
        });
        connection.query(`USE ${dbname}`, function (e) {
            if (e)
                throw e;
            console.log("Base de données prête à l'emploi.");
        });
    }
    createTable(table_name, connection = this.db_connection) {
        let sqlQuery = "CREATE TABLE " + table_name + "(e_id INTEGER NOT NULL , name VARCHAR(255) NOT NULL, description LONGTEXT, size VARCHAR(10), state INTEGER NOT NULL, status INTEGER, brand VARCHAR(255) NOT NULL, buy_price INTEGER NOT NULL, buy_date DATE NOT NULL, currency VARCHAR(3) NOT NULL, pictures LONGTEXT, ship_size INTEGER NOT NULL, color VARCHAR(50), buy_country VARCHAR(50) NOT NULL)";
        connection.query(sqlQuery, function (e) {
            if (e)
                throw e;
            console.log("Table créée avec succès.");
        });
    }
    insert(e_id, name, description, size, state, status, brand, buy_price, buy_date, currency, ship_size, color, buy_country, connection = this.db_connection) {
        var sqlQuery = `INSERT INTO Purchases (e_id,name,description,size,state,status,brand,buy_price,buy_date,currency,ship_size,color,buy_country) VALUES ${e_id} + ',' + ${name} + ',' + ${description} + ',' + ${size} + ',' + ${state} + ',' + ${status}
            + ',' + ${brand} + ',' + ${buy_price} + ',' + ${buy_date} + ',' + ${currency} + ',' + ${ship_size} + ',' + ${color} + ',' + ${buy_country})`;
        connection.query(sqlQuery, function (e) {
            if (e)
                throw e;
            console.log("1 record inserted");
        });
    }
    remove(e_id, connection = this.db_connection) {
        var sqlQuery = `DELETE FROM customers WHERE e_id=${e_id}`;
        connection.query(sqlQuery, function (e, res) {
            if (e)
                throw e;
            console.log("Number of records deleted: " + res.affectedRows);
        });
    }
    openConnection(connection = this.db_connection) {
        connection.connect(function (e) {
            if (e)
                throw e;
        });
    }
    closeConnection(connection = this.db_connection) {
        connection.end(function (e) {
            if (e)
                throw e;
        });
    }
}
exports.dbManager = dbManager;

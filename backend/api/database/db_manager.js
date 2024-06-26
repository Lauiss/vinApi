//require = require('esm')(module);
import mysql from 'mysql';
//let mysql = require('mysql');

export class DbManager {
    db_name;
    db_connection;

    constructor(dbname, dbuname, dbpwd){
        this.db_name = dbname;

        this.db_connection = mysql.createConnection({
            host: '127.0.0.1',
            user:dbuname,
            password:dbpwd,
        })
        this.createDb();
        this.db_connection.end();
        
        this.db_connection = mysql.createConnection({
            host: '127.0.0.1',
            user:dbuname,
            password:dbpwd,
            database:dbname
        });

        this.createTablePurchases();
        this.createTableLinks();
    }

    createDb(connection=this.db_connection, dbname=this.db_name){
        return new Promise((resolve, reject) => {
            connection.query(`CREATE DATABASE IF NOT EXISTS ${dbname}`, function(e){
                if(e) throw e 
            console.log("Base de données créée avec succès.")})

            connection.query(`USE ${dbname}`, function(e, res){
                if(e) throw e 
            console.log("Base de données prête à l'emploi.");
            return res;
            })
        });
    }

    createTablePurchases(connection=this.db_connection){
        return new Promise((resolve, reject) => {
            let sqlQuery = "CREATE TABLE IF NOT EXISTS Purchases (e_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, description LONGTEXT, size VARCHAR(10), state INTEGER NOT NULL, status INTEGER, brand VARCHAR(255) NOT NULL, buy_price INTEGER NOT NULL, buy_date VARCHAR(255) NOT NULL, currency VARCHAR(3) NOT NULL, pictures LONGTEXT, ship_size INTEGER NOT NULL, color VARCHAR(50), buy_country VARCHAR(3) NOT NULL);";
            connection.query(sqlQuery, function (e, res) {
                if (e) throw e;
                console.log("Table créée avec succès.");
                return res;
            });
        });
    }

    createTableLinks(connection=this.db_connection){
        return new Promise((resolve, reject) => {
            let sqlQuery = "CREATE TABLE IF NOT EXISTS Links (l_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, link LONGTEXT);";
            connection.query(sqlQuery, function (e, res) {
            if (e) throw e;
                console.log("Table créée avec succès.");
                return res;
            });
        });
}

    insert(entity, connection=this.db_connection){
        return new Promise((resolve, reject) => {
            var sqlQuery = `INSERT INTO Purchases (name,description,size,state,status,brand,buy_price,buy_date,currency,ship_size,color,buy_country) VALUES ('${entity.name}','${entity.description}','${entity.size}',${entity.state},${entity.status},'${entity.brand}',${entity.buy_price},'${entity.buy_date}','${entity.currency}',${entity.ship_size},'${entity.color}','${entity.buy_country}');`;
            connection.query(sqlQuery, function (e, res) {
              if (e) throw e;
              console.log(res.affectedRows + " record(s) inserted");
              return res;
            });
        });
    }

    remove(e_id, connection=this.db_connection){
        return new Promise((resolve, reject) => {
            var sqlQuery = `DELETE FROM customers WHERE e_id=${e_id};`;
            connection.query(sqlQuery, function (e, res) {
              if (e) throw e;
              console.log("Number of records deleted: " + res.affectedRows);
              return res;
            });
        });

    }

    update(update_row, where_condition,connection=this.db_connection){
        return new Promise((resolve, reject) => {
            connection.connect(function(e) {
                if (e) throw e;
                var sql = "UPDATE customers SET " + update_row + " " + where_condition + ";";
                connection.query(sql, function (e, res) {
                  if (e) throw e;
                  console.log(res.affectedRows + " ligne(s) modifiée(s)");
                  return res;
                });
              });
        });
    }

    openConnection(connection=this.db_connection){
        return new Promise((resolve, reject) => {
            connection.connect(function(e) {
                if (e) throw e;
            });
        });
    }

    closeConnection(connection=this.db_connection){
        return new Promise((resolve, reject) => {
            connection.end(function(e) {
                if (e) throw e;
            });
        });
    }

    queryDb(query, connection = this.db_connection){
        return new Promise((resolve, reject) => {
          connection.query(query, function (e, res) {
            if (e) {
              reject(e);
            } else {
              console.log(res);
              resolve(res);
            }
          });
        });
      }
}
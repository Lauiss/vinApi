let mysql = require('mysql');

export class dbManager {
    db_name: string;
    public db_connection: any;

    constructor(dbname: string, dbuname: string, dbpwd: string){
        this.db_name = dbname;

        this.db_connection = mysql.createConnection({
            host: '127.0.0.1',
            user:dbuname,
            password:dbpwd,
            database:dbname
        })
    }

    createDb(connection=this.db_connection, dbname=this.db_name){
            connection.query(`CREATE DATABASE ${dbname} IF NOT EXISTS`, function(e:Error){
                if(e) throw e 
            console.log("Base de données créée avec succès.")})

            connection.query(`USE ${dbname}`, function(e:Error){
                if(e) throw e 
            console.log("Base de données prête à l'emploi.")})
    }

    createTable(table_name:string, connection=this.db_connection){
            let sqlQuery: string = "CREATE TABLE " + table_name + "(e_id INTEGER NOT NULL , name VARCHAR(255) NOT NULL, description LONGTEXT, size VARCHAR(10), state INTEGER NOT NULL, status INTEGER, brand VARCHAR(255) NOT NULL, buy_price INTEGER NOT NULL, buy_date DATE NOT NULL, currency VARCHAR(3) NOT NULL, pictures LONGTEXT, ship_size INTEGER NOT NULL, color VARCHAR(50), buy_country VARCHAR(50) NOT NULL)";
            connection.query(sqlQuery, function (e: Error) {
                if (e) throw e;
                console.log("Table créée avec succès.");
            });
    }

    insert(e_id:number, name:string, description:string, size:string, state:number, status:number, brand:string, buy_price:number, 
           buy_date:Date, currency:string, ship_size:number, color:string, buy_country:string, connection=this.db_connection){
            var sqlQuery = `INSERT INTO Purchases (e_id,name,description,size,state,status,brand,buy_price,buy_date,currency,ship_size,color,buy_country) VALUES ${e_id} + ',' + ${name} + ',' + ${description} + ',' + ${size} + ',' + ${state} + ',' + ${status}
            + ',' + ${brand} + ',' + ${buy_price} + ',' + ${buy_date} + ',' + ${currency} + ',' + ${ship_size} + ',' + ${color} + ',' + ${buy_country})`;
            connection.query(sqlQuery, function (e: Error) {
              if (e) throw e;
              console.log("1 record inserted");
            });
    }

    remove(e_id:number, connection=this.db_connection){
            var sqlQuery = `DELETE FROM customers WHERE e_id=${e_id}`;
            connection.query(sqlQuery, function (e:Error, res:any) {
              if (e) throw e;
              console.log("Number of records deleted: " + res.affectedRows);
            });

    }

    openConnection(connection=this.db_connection){
        connection.connect(function(e:Error) {
            if (e) throw e;
        });
    }

    closeConnection(connection=this.db_connection){
        connection.end(function(e:Error) {
            if (e) throw e;
        });
    }
}
import express from 'express';
import { DbManager } from './database/db_manager';
import { Util } from './utils/utils';
import { ProxyManager } from './proxy_manager/proxy_manager';
import { VintedFetcher } from './vinted_fetcher/vinted_fetcher.js';
/*
const db_Manager = new dbManager('vindb','root','root');
const util = new Util();
//db_Manager.queryDb("DROP TABLE Purchases");
db_Manager.createTable('Purchases');

let testItem = {
                name: 'Sweat addidas', 
                description: 'carré comme le nord de la corée', 
                size: 'L', 
                state:5,
                status:1,
                brand: 'addidas',
                buy_price:10,
                buy_date: util.dateToString(new Date()),
                currency:'EUR',
                ship_size:0,
                color:'Bleu',
                buy_country:'FRA'
                }
// name => String 255 max
// description => String Longtext
// size =>
// state => 0: satisfaisant 1 : Bon état 2: Très bon état 3: neuf sans étiquettes 4: neuf + étiquettes
// status => 0: indisponible 1: disponible 2: réservé
// brand =>
// buy_price => Int
// buy_date => Date()
// currency => String(3)
//ship_size => 0: petit 1: moyen 2: grand
//color => String
//buy_country => Pays d'achat

db_Manager.insert(testItem);
db_Manager.queryDb("SELECT * FROM Purchases");
db_Manager.closeConnection();
*/

const app: any = express();
const dbManager = new DbManager('vindb','root','root');
const proxyManager = new ProxyManager();
const vintedFetcher = new VintedFetcher();

app.get('/', (req: any, res: any) => {
    res.send({status:200, message:"API en ligne."});
})

app.get('/getLinks', (req: any, res: any) => {
    res.send({result: dbManager.queryDb("SELECT * FROM Links;")});
})

app.get('/getAllPurchases', (req: any, res: any) => {
    res.send({result: dbManager.queryDb("SELECT * FROM Purchases;")});
})

app.get('/initDb', (req:any, res:any) => {
    res.send({createDb: dbManager.createDb(), createTablePurchases: dbManager.createTablePurchases(), createTableLinks: dbManager.createTableLinks()});
})

app.post('/insert', (req: any, res: any) => {
    res.send({status: dbManager.insert(req.body)})
})

app.post('/remove', (req: any, res: any) => {
    res.send({status: dbManager.insert(req.body.item)})
})

app.post('/update', (req: any, res: any) => {
    res.send({status: dbManager.update(req.body.query, req.body.where)})
})

app.post('/searchOnVinted', (req: any, res: any) => {
    res.send({res: vintedFetcher.search(req.body.url)})
})

app.get('')
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})


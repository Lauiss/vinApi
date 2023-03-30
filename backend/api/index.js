"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_manager_1 = require("./database/db_manager");
const proxy_manager_1 = require("./proxy_manager/proxy_manager");
const vinted_fetcher_js_1 = require("./vinted_fetcher/vinted_fetcher.js");
/*
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
*/
const app = (0, express_1.default)();
const dbManager = new db_manager_1.DbManager('vindb', 'root', 'root');
const proxyManager = new proxy_manager_1.ProxyManager();
const vintedFetcher = new vinted_fetcher_js_1.VintedFetcher();
app.get('/', (req, res) => {
    res.status(200).send({
        message: "API en ligne."
    });
});
app.get('/getAllLinks', (req, res) => {
    dbManager.queryDb("SELECT * FROM Links;")
        .then(result => {
        res.status(200).send({ result: result });
    })
        .catch((error) => {
        console.error('Une erreur est survenue => ', error);
        res.status(500).send('Internal server error');
    });
});
app.get('/getAllPurchases', (req, res) => {
    dbManager.queryDb('SELECT * FROM Purchases;')
        .then((result) => {
        res.status(200).send(JSON.stringify({ result: result }));
    })
        .catch((error) => {
        console.error('Une erreur est survenue => ', error);
        res.status(500).send('Internal server error');
    });
});
app.get('/initDb', (req, res) => {
    let jsonobject = {};
    dbManager.createDb().then((result) => {
        jsonobject['createDb'] = result;
        dbManager.createTablePurchases().then((result) => {
            jsonobject['createTablePurchases'] = result;
            dbManager.createTableLinks().then((result) => {
                jsonobject['createTableLinks'] = result;
                res.status(200).send(jsonobject);
            }).catch((error) => {
                console.error('Une erreur est survenue => ', error);
                res.status(500).send('Internal server error');
            }).catch((error) => {
                console.error('Une erreur est survenue => ', error);
                res.status(500).send('Internal server error');
            });
        }).catch((error) => {
            console.error('Une erreur est survenue => ', error);
            res.status(500).send('Internal server error');
        });
    });
});
app.post('/insert', (req, res) => {
    dbManager.insert(req.body).then((result) => {
        res.status(200).send({ status: result });
    })
        .catch((error) => {
        console.error('Une erreur est survenue => ', error);
        res.status(500).send('Internal server error');
    });
});
app.post('/remove', (req, res) => {
    dbManager.insert(req.body.item).then((result) => {
        res.status(200).send({ status: result });
    })
        .catch((error) => {
        console.error('Une erreur est survenue => ', error);
        res.status(500).send('Internal server error');
    });
});
app.post('/update', (req, res) => {
    dbManager.update(req.body.query, req.body.where).then((result) => {
        res.status(200).send({ status: result });
    })
        .catch((error) => {
        console.error('Une erreur est survenue => ', error);
        res.status(500).send('Internal server error');
    });
});
app.post('/searchOnVinted', (req, res) => {
    vintedFetcher.search(req.body.url).then((result) => {
        res.status(200).send({ result: result });
    })
        .catch((error) => {
        console.error('Une erreur est survenue => ', error);
        res.status(500).send('Internal server error');
    });
});
app.listen(3000, () => {
    console.log('Le serveur est à l\'écoute sur le port 3000');
});

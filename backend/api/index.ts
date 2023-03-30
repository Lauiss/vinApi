import express from 'express';
import { DbManager } from './database/db_manager';
import { Util } from './utils/utils';
import { ProxyManager } from './proxy_manager/proxy_manager';
import { VintedFetcher } from './vinted_fetcher/vinted_fetcher.js';
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

const app: any = express();
const dbManager = new DbManager('vindb','root','root');
const proxyManager = new ProxyManager();
const vintedFetcher = new VintedFetcher();

app.get('/', (req: any, res: any) => {
    res.status(200).send({
        message:"API en ligne."});
})

app.get('/getAllLinks', (req: any, res: any) => {
    dbManager.queryDb("SELECT * FROM Links;")
    .then(result => {
        res.status(200).send({result: result});
    })
    .catch((error) => {
        console.error('Une erreur est survenue => ', error);
        res.status(500).send('Internal server error');
      });
})

app.get('/getAllPurchases', (req: any, res: any) => {
    dbManager.queryDb('SELECT * FROM Purchases;')
      .then((result) => {
        res.status(200).send(JSON.stringify({result: result }));
      })
      .catch((error) => {
        console.error('Une erreur est survenue => ', error);
        res.status(500).send('Internal server error');
      });
  });

/*app.get('/initDb', (req:any, res:any) => {
    let jsonobject: any = {};
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
    })
})*/

// prend en paramètre un objet avec les colonnes de l'objet testItem
app.post('/insert', (req: any, res: any) => {
    dbManager.insert(req.body).then((result) => {
        res.status(200).send({status: result});})
    .catch((error) => {
        console.error('Une erreur est survenue => ', error);
        res.status(500).send('Internal server error');
    });
})

// prend en paramètre un objet avec les colonnes de l'objet testItem
app.post('/remove', (req: any, res: any) => {
    dbManager.insert(req.body.item).then((result) => {
        res.status(200).send({status: result});})
    .catch((error) => {
        console.error('Une erreur est survenue => ', error);
        res.status(500).send('Internal server error');
    });
})

// prend en paramètre un query sous la forme "UPDATE table SET col1 = val1, col2 = val2 WHERE col3 = val3"
// un paramètre where sous la forme "col3 = val3"
app.post('/update', (req: any, res: any) => {
    dbManager.update(req.body.query, req.body.where).then((result) => {
        res.status(200).send({status: result});})
    .catch((error) => {
        console.error('Une erreur est survenue => ', error);
        res.status(500).send('Internal server error');
    });
})

//prend en paramètre une url de recherche vinted a passer en POST
app.post('/searchOnVinted', (req: any, res: any) => {
    vintedFetcher.search(req.body.url).then((result) => {
        res.status(200).send({result: result});})
    .catch((error) => {
        console.error('Une erreur est survenue => ', error);
        res.status(500).send('Internal server error');
    });
})

app.listen(3000, () => {
    console.log('Le serveur est à l\'écoute sur le port 3000');
});





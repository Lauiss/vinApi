"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const proxy_manager_1 = require("./proxy_manager/proxy_manager");
const vinted_fetcher_1 = require("./vinted_fetcher/vinted_fetcher");
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

/*const app: any = express();
app.get('/', (req: any, res: any) => {
    res.send('Well done!');
})
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})*/
const proxyManager = new proxy_manager_1.ProxyManager();
proxyManager.initAddrAndPort().then(() => {
    console.log(proxyManager.getProxies());
    console.log('ok');
    const vintedFetcher = new vinted_fetcher_1.VintedFetcher();
    vintedFetcher.fetchVitedCookie().then((res) => console.log(res))
        .catch((e) => { console.log(e); });
})
    .catch((e) => { console.log('Erreur lors de la récupération des proxys : ' + e); });

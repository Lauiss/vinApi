"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_manager_1 = require("./database/db_manager");
const utils_1 = require("./utils/utils");
const db_Manager = new db_manager_1.dbManager('vindb', 'root', 'root');
const util = new utils_1.Util();
db_Manager.queryDb("DROP TABLE Purchases");
db_Manager.createTable('Purchases');
let testItem = {
    name: 'Sweat addidas',
    description: 'carré comme le nord de la corée',
    size: 'L',
    state: 5,
    status: 1,
    brand: 'addidas',
    buy_price: 10,
    buy_date: util.dateToString(new Date()),
    currency: 'EUR',
    ship_size: 0,
    color: 'Bleu',
    buy_country: 'FRA'
};
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
console.log('cacacacaa' + testItem.buy_date);
/*const app: any = express();
app.get('/', (req: any, res: any) => {
    res.send('Well done!');
})
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})*/ 

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_manager_1 = require("./database/db_manager");
const db_Manager = new db_manager_1.dbManager('vindb', 'root', 'root');
db_Manager.createDb();
console.log('ok');
db_Manager.createTable('Purchases');
db_Manager.closeConnection();
/*const app: any = express();
app.get('/', (req: any, res: any) => {
    res.send('Well done!');
})
app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})*/

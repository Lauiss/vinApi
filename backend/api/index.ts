import express from 'express';
import { dbManager } from './database/db_manager';

const db_Manager = new dbManager('vindb','root','root');
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

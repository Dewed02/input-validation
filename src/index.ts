import express, { Express } from 'express';
import * as handlers from './handlers';
import bodyParser from 'body-parser';


const app: Express = express();
const port = 10000;

app.use(bodyParser.json()); 

app.post('/books/new', handlers.createBook);
app.get('/books/price', handlers.getPrice);

app.post('/customers/new', handlers.createCustomer);
app.put('/customers/address', handlers.updateCustomerAddress);
app.get('/customers/address', handlers.getCustomerAddress);
app.get('/customers/balance', handlers.getCustomerBalance);



app.post('/orders/new', handlers.createOrder);
app.get('/orders/shipped', handlers.getShipmentStatus);
app.put('/orders/ship', handlers.shipOrder);
app.get('/orders/status', handlers.getOrderStatus);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

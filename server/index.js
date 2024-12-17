import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

import productRouter from './src/routes/productRouter.js';
import customerRouter from './src/routes/customerRouter.js';
import vendorRouter from './src/routes/vendorRouter.js';
import stockInRouter from './src/routes/stockInRouter.js';

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Stockipy API');
});

//for products routing
app.use('/api', productRouter);
app.get('/v1/products', productRouter);
app.get('/v1/products/:id', productRouter);
app.post('/v1/products', productRouter);
app.put('/v1/products/:id', productRouter);
app.delete('/v1/products/:id', productRouter);

//vendor routing
app.use('/api', vendorRouter);
app.get('/v1/vendors', vendorRouter);
app.get('/v1/vendors/:id', vendorRouter);
app.post('/v1/vendors', vendorRouter);
app.put('/v1/vendors/:id', vendorRouter);
app.delete('/v1/vendors/:id', vendorRouter);

//customer routing
app.use('/api', customerRouter);
app.get('/v1/customers', customerRouter);
app.get('/v1/customers/:id', customerRouter);
app.post('/v1/customers', customerRouter);
app.put('/v1/customers/:id', customerRouter);
app.delete('/v1/customers/:id', customerRouter);

//stock In routing
app.use('/api', stockInRouter);
app.get('/v1/stock-ins', stockInRouter);
app.get('/v1/stock-ins/:id', stockInRouter);
app.post('/v1/stock-ins', stockInRouter);
app.put('/v1/stock-ins/:id', stockInRouter);
app.delete('/v1/stock-ins/:id', stockInRouter);

//stock out routing




// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

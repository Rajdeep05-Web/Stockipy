import { Router } from 'express';
import { addProduct, deleteProduct, fetchProducts, getProduct, updateProduct } from '../controllers/productController.js';
// import {test} from '../controllers/test.js';

const productRouter = Router();

productRouter.get('/v1/products', fetchProducts);
productRouter.get('/v1/products/:id', getProduct);
productRouter.post('/v1/products', addProduct);
productRouter.put('/v1/products/:id', updateProduct);
productRouter.delete('/v1/products/:id', deleteProduct);


export default productRouter;
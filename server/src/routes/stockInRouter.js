import Router from 'express';
import { addStockIn, updateStockIn, getStockInById, getStockIns, deleteStockIn } from '../controllers/stockInController.js';

const stockInRouter = Router();

stockInRouter.get('/v1/stock-ins', getStockIns);
stockInRouter.get('/v1/stock-ins/:id', getStockInById);
stockInRouter.post('/v1/stock-ins', addStockIn);
stockInRouter.put('/v1/stock-ins/:id', updateStockIn);
stockInRouter.delete('/v1/stock-ins/:id', deleteStockIn);

export default stockInRouter;

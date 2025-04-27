import Router from 'express';
import { fetchCustomer, fetchCustomers, addCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController.js';
import dbConnectMiddleware from "../middlewares/dbConnectMiddleware.js";

const customerRouter = Router();

customerRouter.use(dbConnectMiddleware);
customerRouter.get('/v1/customers/:userId', fetchCustomers);
customerRouter.get('/v1/customerById/:userId/:cId', fetchCustomer);
customerRouter.post('/v1/customers/:userId', addCustomer);
customerRouter.put('/v1/customers/:userId/:cId', updateCustomer);
customerRouter.delete('/v1/customers/:userId/:cId', deleteCustomer);

export default customerRouter;
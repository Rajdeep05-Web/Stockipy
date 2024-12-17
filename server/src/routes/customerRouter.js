import Router from 'express';
import { fetchCustomer, fetchCustomers, addCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController.js';

const customerRouter = Router();

customerRouter.get('/v1/customers', fetchCustomers);
customerRouter.get('/v1/customers/:id', fetchCustomer);
customerRouter.post('/v1/customers', addCustomer);
customerRouter.put('/v1/customers/:id', updateCustomer);
customerRouter.delete('/v1/customers/:id', deleteCustomer);

export default customerRouter;
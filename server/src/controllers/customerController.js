import { Customer } from '../models/customerModel.js';
import { User } from '../models/userModel.js';
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

export const fetchCustomers = async (req, res) => {
    const { userId } = req.params;
    if (!userId || !ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    try {
        // const exist = await User.findById(userId);
        const customers = await Customer.find({ userId: userId });
        if (customers.length === 0) {
            return res.status(404).json({ error: 'No customers found for this user' });
        }
        return res.status(200).json(customers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export const fetchCustomer = async (req, res) => {
    const { userId, cId } = req.params;
    if (!userId || !ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    if (!cId || !ObjectId.isValid(cId)) {
        return res.status(400).json({ error: 'Customer ID is required' });
    }
    try {
        const customer = await Customer.findOne({ userId: userId, _id: cId });
        if (!customer) {
            return res.status(404).json({ error: 'Customer for this user not found' });
        }

        return res.status(200).json(customer);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export const addCustomer = async (req, res) => {
    const { userId } = req.params;
    const customer = req.body;
    if (!userId || !ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    if (!customer) {
        return res.status(400).json({ error: 'Customer is required' });
    }
    if (!customer.name || !customer.address || customer.name === '' || customer.address === '') {
        return res.status(400).json({ error: 'Name and address required' }); //corrected
    }
    if (customer.name) {
        customer.name = customer.name.trim();
        if (customer.name.length < 3) {
            return res.status(400).json({ error: 'Name must be atleast 3 characters long' });
        }
    }
    if (customer.phone && parseInt(customer.phone) < 0) {
        return res.status(400).json({ error: 'Phone number must be greater than 0 and 10 digits' });
    }
    if (customer.phone && customer.phone.length !== 10) {
        return res.status(400).json({ error: 'Phone number must be 10 digits' });
    }
    if (customer.gstNo && customer.gstNo.length !== 15) {
        return res.status(400).json({ error: 'GST number must be 15 digits' });
    }
    try {
        //check if customer already exists
        const existingCustomerWithUserId = await Customer.find({ userId: userId });

        //if its not the first time, then check some conditions
        if (existingCustomerWithUserId) {
            //is user exists then check if customer name already exists
            const isPresent = existingCustomerWithUserId.some((c) =>
                customer.name.toLowerCase() === c.name.toLowerCase()
            )
            if (isPresent) {
                return res.status(400).json({ error: 'Customer name already exists' });
            }
            //check if gst is given then check if gst already exists
            const isGstPresent = existingCustomerWithUserId.some((c) => customer.gstNo && customer.gstNo.toLowerCase() === c.gstNo.toLowerCase())
            if (isGstPresent) {
                return res.status(400).json({ error: 'Customer GST number already exists' });
            }
            //check if phne is given then check if phone already exists
            const isPhonePresent = existingCustomerWithUserId.some((c) => customer.phone && customer.phone.toLowerCase() === c.phone.toLowerCase())
            if (isPhonePresent) {
                return res.status(400).json({ error: 'Customer phone number already exists' });
            }
            //check email if given
            const isEmailPresent = existingCustomerWithUserId.some((c) => customer.email && customer.email.toLowerCase() === c.email.toLowerCase())
            if (isEmailPresent) {
                return res.status(400).json({ error: 'Customer email already exists' });
            }
        }

        const newCustomer = new Customer({ userId, ...customer });
        await newCustomer.save();
        const allCustomers = await Customer.find({ userId: userId });
        return res.status(201).json(allCustomers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: `Error while adding new customer: ${error.message}` });
    }
};

export const updateCustomer = async (req, res) => {
    const { userId, cId } = req.params;
    const customer = req.body;
    if (!userId || !ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    if (!cId || !ObjectId.isValid(cId)) {
        return res.status(400).json({ error: 'Customer ID is required' });
    }
    if (!customer) {
        return res.status(400).json({ error: 'New customer data is required' });
    }
    if (!customer.name || !customer.address || customer.name === '' || customer.address === '') {
        return res.status(400).json({ error: 'Name and address required' }); //corrected
    }
    if (customer.name) {
        customer.name = customer.name.trim();
        if (customer.name.length < 3) {
            return res.status(400).json({ error: 'Name must be atleast 3 characters long' });
        }
    }
    if (customer.phone && parseInt(customer.phone) < 0) {
        return res.status(400).json({ error: 'Phone number must be greater than 0 and 10 digits' });
    }
    //phone no from DB is number and from req is string
    if (customer.phone && customer.phone.toString().length !== 10) {
        return res.status(400).json({ error: 'Phone number must be 10 digits' });
    }
    //check for gst
    if (customer.gstNo && customer.gstNo.length !== 15) {
        return res.status(400).json({ error: 'GST number must be 15 digits' });
    }
    try {
        //first find the customer to be updated
        const customerToBeUpdated = await Customer.findOne({userId: userId, _id: cId});
         if (!customerToBeUpdated) {
            return res.status(404).json({ error: 'Customer not found to update' });
        }
        const existingCustomers = await Customer.find({ userId: userId });
        if (!existingCustomers || existingCustomers.length === 0) {
            return res.status(404).json({ error: 'Customers not found for this user' });
        }

        //chack if customer with same name already exists
        const isNamePresent = existingCustomers.some((c) =>
            customer.name.toLowerCase() === c.name.toLowerCase() && !c._id.equals(cId)
        )
        if (isNamePresent) {
            return res.status(400).json({ error: 'Customer name already exists' });
        }

        //check if gst is given then check if gst already exists
        const isGstNoPresent = existingCustomers.some((c) => customer.gstNo && (c.gstNo && customer.gstNo.toLowerCase() === c.gstNo.toLowerCase() && !c._id.equals(cId)));
        if (isGstNoPresent) {
            return res.status(400).json({ error: 'Customer GST number already exists' });
        }

        //check if phne is given then check if phone already exists
        const isPhonePresent = existingCustomers.some((c) => customer.phone && (c.phone && customer.phone.toLowerCase() === c.phone.toLowerCase() && !c._id.equals(cId)));
        if (isPhonePresent) {
            return res.status(400).json({ error: 'Customer phone number already exists' });
        }

        //check email if given
        const isEmailPresent = existingCustomers.some((c) => customer.email && (c.email && !c._id.equals(cId) && customer.email.toLowerCase() === c.email.toLowerCase()));
        if (isEmailPresent) {
            return res.status(400).json({ error: 'Customer email already exists' });
        }
        
        //now update the customer
        Object.keys(customer).forEach((key) => {
            if (customer[key] !== undefined) {
                customerToBeUpdated[key] = customer[key];
            }
        });

        //save the customer
        const response = await customerToBeUpdated.save();
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export const deleteCustomer = async (req, res) => {

    const { userId, cId } = req.params;
    if (!userId || !ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'User ID is required' });
    }
    if (!cId || !ObjectId.isValid(cId)) {
        return res.status(400).json({ error: 'Customer ID is required' });
    }
    try {
        //now check that if customer exists or not for the user
        const existingCustomerWithUserId = await Customer.find({ userId: userId, _id: cId });
        if (!existingCustomerWithUserId) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        //check if customer exists in the customer array
        const result = await Customer.deleteOne({ userId: userId, _id: cId });
        console.log("Delete result: ", result);
        if (result.acknowledged) {
            return res.status(200).json({ message: 'Customer deleted successfully' });
        } else {
            return res.status(500).json({ error: 'Error while deleting customer' });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
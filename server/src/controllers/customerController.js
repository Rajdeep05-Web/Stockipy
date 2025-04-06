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
        const exist = await User.findById(userId);
        if (!exist) {
            return res.status(404).json({ error: 'User not found' });
        }
        const customers = await Customer.findOne({ userId: userId });
        if (!customers?.customerDetails || customers?.customerDetails.length === 0) {
            return res.status(404).json({ error: 'No customers found' });
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
        const exist = await User.findById(userId);
        if (!exist) {
            return res.status(404).json({ error: 'User not found' });
        }
        const customers = await Customer.findOne({ userId: userId });
        if (!customers) {
            return res.status(404).json({ error: 'Customer for this user not found' });
        }
        const customer = customers.customerDetails.find((c) => c._id.toString() === cId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }

        return res.status(200).json(customer);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export const addCustomer = async (req, res) => {
    const { userId } = req.params;
    const { customer } = req.body;
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
        const existingCustomerWithUserId = await Customer.findOne({ userId: userId });
        //if its first time adding customer, create new customer
        if (!existingCustomerWithUserId) {
            const newCustomer = new Customer({ userId, customerDetails: [customer] });

            const response = await newCustomer.save();
            return res.status(200).json(response);
        } else {
            //is user exists then check if customer name already exists
            const isPresent = existingCustomerWithUserId.customerDetails.some((c) =>
                customer.name.toLowerCase() === c.name.toLowerCase()
            )
            if (isPresent) {
                return res.status(400).json({ error: 'Customer name already exists' });
            }
            //check if gst is given then check if gst already exists
            const isGstPresent = existingCustomerWithUserId.customerDetails.some((c) => customer.gstNo && customer.gstNo.toLowerCase() === c.gstNo.toLowerCase())
            if (isGstPresent) {
                return res.status(400).json({ error: 'Customer GST number already exists' });
            }
            //check if phne is given then check if phone already exists
            const isPhonePresent = existingCustomerWithUserId.customerDetails.some((c) => customer.phone && customer.phone.toLowerCase() === c.phone.toLowerCase())
            if (isPhonePresent) {
                return res.status(400).json({ error: 'Customer phone number already exists' });
            }
            //check email if given
            const isEmailPresent = existingCustomerWithUserId.customerDetails.some((c) => customer.email && customer.email.toLowerCase() === c.email.toLowerCase())
            if (isEmailPresent) {
                return res.status(400).json({ error: 'Customer email already exists' });
            }

            //if user exists then push the new customer to the customer array
            existingCustomerWithUserId.customerDetails.push(customer);
            const response = await existingCustomerWithUserId.save();
            return res.status(200).json(response);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: `Error while adding new customer: ${error.message}` });
    }
};

export const updateCustomer = async (req, res) => {
    const { userId, cId } = req.params;
    const { customer } = req.body;
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
        const customerDocument = await Customer.findOne({ userId: userId });
        if (!customerDocument || customerDocument?.customerDetails.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        const existingCustomers = customerDocument.customerDetails;

        const customerToBeUpdated = existingCustomers.find((c) => c._id.equals(cId));
        if (!customerToBeUpdated) {
            return res.status(404).json({ error: 'Customer not found' });
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
        const customerIndex = customerDocument.customerDetails.findIndex((c) => c._id.toString() === cId);
        if (customerIndex === -1) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        //update the customer
        const customerToUpdate = customerDocument.customerDetails[customerIndex];

        Object.keys(customer).forEach((key) => {
            if (customer[key] !== undefined) {
                customerToUpdate[key] = customer[key];
            }
        });

        //save the customer
        const updatedCustomerDocument = await customerDocument.save();

        return res.status(200).json(updatedCustomerDocument.customerDetails[customerIndex]);
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

    //now check that if customer exists or not for the user
    
};
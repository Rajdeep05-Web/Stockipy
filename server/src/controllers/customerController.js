import { Customer } from '../models/customerModel.js';

export const fetchCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        if (!customers) {
            return res.status(404).json({ error: 'No customers found' });
        }
        return res.status(200).json(customers);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export const fetchCustomer = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export const addCustomer = async (req, res) => {
    const customer = req.body;
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
    try {
        //check if customer already exists
        const existingCustomers = await Customer.find();
        if (existingCustomers.length > 0) {
            const isPresent = existingCustomers.some((c) =>
                customer.name.toLowerCase() === c.name.toLowerCase()
            );
            if (isPresent) {
                return res.status(400).json({ error: 'Customer already exists' });
            }
            if (customer.phone) {
                const isPhoneNoPresent = existingCustomers.some((c) =>
                    c.phone === customer.phone
                );
                //check if phone number already exists
                if (isPhoneNoPresent) {
                    return res.status(400).json({ error: 'Phone number already exists' });
                }
            }
        }
        //if not present, add customer
        const newCustomer = new Customer(customer);
        await newCustomer.save();
        return res.status(201).json(newCustomer);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const customer = req.body;
    if (!id || !customer) {
        return res.status(400).send('ID or Customer data required');
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
    try {
        const existingCustomers = await Customer.find();
        if (existingCustomers.length > 0) {
            const isPresent = existingCustomers.some((c) =>
                customer.name.toLowerCase() === c.name.toLowerCase() && c._id.toString() !== id
            )
            if (isPresent) {
                return res.status(400).json({ error: 'Customer already exists' });
            }
        }
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            customer,
            { new: true }
        )
        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found to update' });
        }
        return res.status(200).json(updatedCustomer)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send('ID required');
    }
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id);
        return res.status(200).json(deletedCustomer)

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
import { response } from 'express';
import { Customer } from '../models/customerModel.js';

export const signUpUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(name,
            email,
            password);
            const user={
                name,
                email,
                password
            }
            const token = "token";
        return res.status(201).json({ user, token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
export const logInUser = async (req, res) => {
    try {
       
        return res.status(201).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
export const logOutUser = async (req, res) => {
    try {
       
        return res.status(201).json(response);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};
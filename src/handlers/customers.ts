import { Request, Response } from 'express';
import * as db from '../db';
import * as fs from 'fs';

export const createCustomer = async (req: Request, res: Response) => {
    const { name, address, balance } = req.body;
    try {
        await db.createCustomer(name, address, balance);
        const customerCreated = require('fs');
        fs.appendFile('log.txt', `Customer created ${name} with address ${address} and balance ${balance}\n`, (err) => {
            if (err) throw err;
        });
        res.status(201).json({ 'status': 'success' });
    }
    catch (err) {
        if (balance < 0) {
            const details = `Balance cannot be negative. Please enter a valid balance.`;
            res.status(500).json({ 'status': 'failure', 'message': 'An error occurred while processing your request.', 'details': details });
        }
        else {
            const details = `Customer with name ${name} and address ${address} already exists.
        Please verify the spelling and try again, or update your account information.
        IF further assistance is needed do not hesitate to reach out to a member of our staff via email: bookStore12@web.org`;
            res.status(500).json({ 'status': 'failure', 'message': 'An error occurred while processing your request.', 'details': details });
    } 
}
}

export const getCustomerAddress = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const cid = await db.getCustomerIDByName(name);
        const customerAddress = await db.getCustomerAddress(cid);
        res.status(200).json({ customerAddress });
    }
    catch (err) {
        const details = `Customer with name ${name} does not exist. 
    Please verify the spelling and try again, or create an account. 
    IF further assistance is needed do not hesitate to reach out to a member of our staff via email: bookStore12@web.org`; 
        res.status(500).json({ 'status': 'failure', 'message': 'An error occurred while processing your request.', 'details': details });
}
}

export const updateCustomerAddress = async (req: Request, res: Response) => {
    const { name, address } = req.body;
    try {
        const cid = await db.getCustomerIDByName(name);
        await db.updateCustomerAddress(cid, address);
        const customerAddressUpdated = require('fs');
        fs.appendFile('log.txt', `Customer ${name} address updated to ${address}\n`, (err) => {
            if (err) throw err;
        });
        res.status(200).json({ 'status': 'success' });
    }
    catch (err) {
        const details = `Customer with name ${name} does not exist. 
    Please verify the spelling and try again, or create an account. 
    IF further assistance is needed do not hesitate to reach out to a member of our staff via email: bookStore12@web.org`; 
        res.status(500).json({ 'status': 'failure', 'message': 'An error occurred while processing your request.', 'details': details });
    }
}

export const getCustomerBalance = async (req: Request, res: Response) => {
    const { name, address } = req.body;
    try {
        const cid = await db.getCustomerId(name, address);
        const balance = await db.customerBalance(cid);
        const customerBalance = require('fs');
        fs.appendFile('log.txt', `Customer ${name} balance was accessed.\n`, (err) => {
            if (err) throw err;
        });
        res.status(200).json({ balance });
    }
    catch (err) {
        const details = `Customer with name ${name} and address ${address} does not exist.
    Please verify the spelling and try again, or create an account.
    IF further assistance is needed do not hesitate to reach out to a member of our staff via email: bookStore12@web.org`; 
        res.status(500).json({ 'status': 'failure', 'message': 'An error occurred while processing your request.', 'details' :details });
    };
}


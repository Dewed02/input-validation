import { Request, Response } from 'express';
import * as db from '../db';

export const createCustomer = async (req: Request, res: Response) => {
    const { name, shippingAddress, balance } = req.body;
    await db.createCustomer(name, shippingAddress, balance);
    res.status(201).json({ 'status': 'success' });
}

export const getCustomerAddress = async (req: Request, res: Response) => {
    const { name } = req.body;
    try {
        const cid = await db.getCustomerIDByName(name);
        const customerAddress = await db.getCustomerAddress(cid);
        res.status(200).json({ customerAddress });
    }
    catch (err) {
        res.status(500).json({ 'status': 'failure' });
    };
}

export const updateCustomerAddress = async (req: Request, res: Response) => {
    const { name, address } = req.body;
    try {
        const cid = await db.getCustomerIDByName(name);
        await db.updateCustomerAddress(cid, address);
        res.status(200).json({ 'status': 'success' });
    }
    catch (err) {
        res.status(500).json({ 'status': 'failure' });
    }
}

export const getCustomerBalance = async (req: Request, res: Response) => {
    const { name, address } = req.body;
    try {
        const cid = await db.getCustomerId(name, address);
        const balance = await db.customerBalance(cid);
        res.status(200).json({ balance });
    }
    catch (err) {
        res.status(500).json({ 'status': 'failure' });
    };
}


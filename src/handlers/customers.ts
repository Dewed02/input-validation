import { Request, Response } from 'express';
import * as db from '../db';

export const createCustomer = async (req: Request, res: Response) => {
    const { name, shippingAddress } = req.body;
    await db.createCustomer(name, shippingAddress);
    res.status(201).json({ 'status': 'success' });
}

export const getCustomerAddress = async (req: Request, res: Response) => {
    const { cid } = req.body;
    const customerAddress = await db.getCustomerAddress(cid);
    res.status(200).json({ customerAddress });
}

export const updateCustomerAddress = async (req: Request, res: Response) => {
    const { cid, address } = req.body;
    await db.updateCustomerAddress(cid, address);
    res.status(200).json({ 'status': 'success' });
}

export const getCustomerBalance = async (req: Request, res: Response) => {
    const { cid } = req.body;
    const balance = await db.customerBalance(cid);
    res.status(200).json({ balance });
}


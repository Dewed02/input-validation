import { Request, Response } from 'express';
import * as db from '../db';

export const createBook = async (req: Request, res: Response) => {
    const { title, author, price } = req.body; 
    try {
        await db.createBook(title, author, price);
        res.status(201).json({ 'status': 'success' });
    }
    catch (err) {
        res.status(500).json({ 'status': 'failure' });
    }
}


export const getPrice = async (req: Request, res: Response) => {
    const { title, author } = req.body;
    const bid = await db.getBookId(title, author);
    const price = await db.getBookPrice(bid);
    res.status(200).json({ price });
}

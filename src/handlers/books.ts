import { Request, Response } from 'express';
import * as db from '../db';
import * as fs from 'fs';

export const createBook = async (req: Request, res: Response) => {
    const { title, author, price } = req.body; 
    try {
        await db.createBook(title, author, price);
        const bookCreated = require('fs');
        fs.appendFile('log.txt', `Book created ${title} with author ${author} and price ${price}\n`, (err) => {
            if (err) throw err;
        });
        res.status(201).json({ 'status': 'success' });
    }
    catch (err) {
        if (price < 0) {
            const details = `Price cannot be negative. Please enter a valid price.`;
            res.status(500).json({ 'status': 'failure', 'message': 'An error occurred while processing your request.', 'details': details });
        }
        else {
            const details = `Book with title ${title} and author ${author} already exists.`;
            res.status(500).json({ 'status': 'failure', 'message': 'An error occurred while processing your request.', 'details': details});
        }
    }
}


export const getPrice = async (req: Request, res: Response) => {
    const { title, author } = req.body;
    try {
        const bid = await db.getBookId(title, author);
        const price = await db.getBookPrice(bid);
        res.status(200).json({ price });
    }
    catch (err) {
        const details = `Book with title ${title} and author ${author} does not exist.
    Please verify the spelling and try again. 
    IF further assistance is needed do not hesitate to reach out to a member of our staff via email: bookStore12@web.org`;
        res.status(500).json({ 'status': 'failure', 'message': 'An error occurred while processing your request.', 'details': details });
    }
}

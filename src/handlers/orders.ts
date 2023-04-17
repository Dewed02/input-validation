import { Request, Response } from "express";
import * as db from "../db";
import * as fs from "fs";

export const createOrder = async (req: Request, res: Response) => {
    const { title, author, name, address } = req.body;
    try {
        const bid = await db.getBookId(title, author);
        const cid = await db.getCustomerId(name, address);
        await db.createPurchaseOrder(bid, cid);
        const orderCreated = require('fs');
        fs.appendFile('log.txt', `Order with: Book ${title} was orderd by Customer ${name} from ${address}\n`, (err) => {
            if (err) throw err;
        });
        res.status(201).json({ 'status': 'success' });
    }
    catch (err) {
        const details = `Book with title ${title} or author ${author} does not exist. Or customer with name ${name} or address ${address} does not exist.
        Please verify the spelling of all fields try again.
        IF further assistance is needed do not hesitate to reach out to a member of our staff via email: bookStore12@web.org`;
        res.status(500).json({ 'status': 'failure', 'message': 'An error occurred while processing your request.', 'details': details });
    }   
}

export const getShipmentStatus = async (req: Request, res: Response) => {
    const { title, author, name, address } = req.body;
    try {
        const bid = await db.getBookId(title, author);   
        const cid = await db.getCustomerId(name, address);
        const pid = await db.getPOIdByContents(bid, cid);
        const shipped = await db.isPoShipped(pid);
        res.status(200).json({ shipped });
    }
    catch (err) {
        const details = `Book with title ${title} and author ${author} does not exist.
    Please verify the spelling and try again.
    IF further assistance is needed do not hesitate to reach out to a member of our staff via email: bookStore12@web.org`;
        res.status(500).json({ 'status': 'failure', 'message': 'An error occurred while processing your request.', 'details': details });
}
}

export const shipOrder = async (req: Request, res: Response) => {
    const { title, author, name, address } = req.body;
    try {
        const bid = await db.getBookId(title, author);
        const cid = await db.getCustomerId(name, address);
        const pid = await db.getPOIdByContents(bid, cid);
        await db.shipPo(pid);
        const orderShipped = require('fs');
        fs.appendFile('log.txt', `Order with: Book ${title} was shipped to Customer ${name} from ${address}\n`, (err) => {
            if (err) throw err;
        });
        res.status(200).json({ 'status': 'success' });
    }
    catch (err) {
        const details = `Order Containing: Book with title ${title} and author ${author} and Customer with name ${name} and address ${address} does not exist.
    Please verify the spelling and try again.
    IF further assistance is needed do not hesitate to reach out to a member of our staff via email: bookStore12@web.org`;
        res.status(500).json({ 'status': 'failure', 'message': 'An error occurred while processing your request.', 'details': details });
}
}

export const getOrderStatus = async (req: Request, res: Response) => {
    const { title, author, name, address } = req.body;
    try {
        const bid = await db.getBookId(title, author);
        const cid = await db.getCustomerId(name, address);
        const pid = await db.getPOIdByContents(bid, cid);
        const shipped = await db.isPoShipped(pid);
        const addr = await db.getCustomerAddress(cid);
        res.status(200)
        res.send(Buffer.from(`
        <html>
        <head>
        <title>Order Status</title>
        </head>
        <body>
            <h1>Order Status</h1>
            <p>Order ID: ${pid}</p>
            <p>Book ID: ${bid}</p>
            <p>Customer ID: ${cid}</p>
            <p>Is Shipped: ${shipped}</p>
            <p>Shipping Address: ${addr}</p>
        </body>
        </html>
        `));
    }
    catch (err) {
        const details = `Order Containing: Book with title ${title} and author ${author} and Customer with name ${name} and address ${address} does not exist.
    Please verify the spelling and try again.
    IF further assistance is needed do not hesitate to reach out to a member of our staff via email: bookStore12@web.org`;
        res.status(500).json({ 'status': 'failure', 'message': 'An error occurred while processing your request.', 'details': details });
    }
}

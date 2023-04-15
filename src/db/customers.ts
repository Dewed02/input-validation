import { connect } from './db';

export const createCustomer = async (name: string, address: string): Promise<number> => {
    const db = await connect();
    console.log(name, address);
    await db.run(`INSERT INTO Customers (name, shippingAddress) VALUES (:name, :address)`, {
        ':name': name,
        ':address': address
    });
    return getCustomerId(name, address);
}

export const getCustomerId = async (name: string, address: string): Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT id FROM Customers WHERE name = :name AND shippingAddress = :address`, {
        ':name': name,
        ':address': address
    });
    return result.id;
}

export const getCustomerAddress = async (cid: number): Promise<string> => {
    const db = await connect();
    let address : string[] = [];
    await db.each(`SELECT shippingAddress FROM Customers WHERE id = :cid`,
    {
        ':cid': cid
    }, (err, row) => {
        address.push(row.shippingAddress);
    });
    console.log(address);
    return address.toString();
}

export const updateCustomerAddress = async (cid: number, address: string): Promise<void> => {
    const db = await connect();
    await db.run(`UPDATE Customers SET shippingAddress = ? WHERE id = ?`, [address, cid]);
}

export const customerBalance = async (cid: number): Promise<number> => {
    const db = await connect();
    const result = await db.get(`SELECT accountBalance FROM Customers WHERE id = ?`, [cid]);
    return result.accountBalance;
}

export const chargeCustomerForPO = async (pid: number) => {
    const db = await connect();
    const customerBalance = await db.get(`SELECT accountBalance FROM Customers WHERE id = (SELECT customerId FROM PurchaseOrders WHERE id = ?)`, [pid]);
    const poPrice = await db.get(`SELECT price FROM Books WHERE id = (SELECT bookId FROM PurchaseOrders WHERE id = ?)`, [pid]);
    await db.run(`UPDATE Customers SET accountBalance = ? WHERE id = (SELECT customerId FROM PurchaseOrders WHERE id = ?)`, [customerBalance.accountBalance - poPrice.price, pid]);
}
import { connect } from './db';

export const createCustomer = async (name: string, address: string, accountBalance: number): Promise<number> => {
    const db = await connect();
    await db.run(`INSERT INTO Customers (name, shippingAddress, accountBalance) VALUES (:name, :address, :accountBalance)`, {
        ':name': name,
        ':address': address,
        ':accountBalance': accountBalance
    });
    return getCustomerId(name, address);
}

export const getCustomerId = async (name: string, address: string): Promise<number> => {
    const db = await connect();
    let customerID = 0;
    await db.each(`SELECT id FROM Customers WHERE name = :name AND shippingAddress = :address`,
    {
        ':name': name,
        ':address': address
    }, (err, row) => {
        customerID = row.id;
    });
    return customerID;
}

// Not best practice but without knowing the customer's ID beforehand this allows us to find it without their address
// This function is only used by get address function and update address function
export const getCustomerIDByName = async (name: string): Promise<number> => {
    const db = await connect();
    let result = 0;
    await db.each(`SELECT id FROM Customers WHERE name = :name`,
    {
        ':name': name
    }, (err, row) => {
        result = row.id;
    });
    return result;
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
    await db.run(`UPDATE Customers SET shippingAddress = :address WHERE id = :cid`, {
        ':address': address,
        ':cid': cid
    });
}

export const customerBalance = async (cid: number): Promise<number> => {
    const db = await connect();
    let balance = 0;
    await db.each(`SELECT accountBalance FROM Customers WHERE id = :cid`, 
    {
        ':cid': cid
    }, (err, row) => {
        balance = row.accountBalance;
    });
    return balance;
}

export const chargeCustomerForPO = async (pid: number) => {
    const db = await connect();
    let cid = 0;
    await db.each(`SELECT customerId FROM PurchaseOrders WHERE id = :pid`, {
        ':pid': pid
        }, (err, row) => {
            cid = row.customerId;
        });
    let balance = await customerBalance(cid);
    let bid = 0;
    await db.each(`SELECT bookId FROM PurchaseOrders WHERE id = :pid`, {
        ':pid': pid
        }, (err, row) => {
            bid = row.bookId;
        }
    );
    let price = 0;
    await db.each(`SELECT price FROM Books WHERE id = :bid`, {
        ':bid': bid
        }, (err, row) => {
            price = row.price;
        }
    );
    await db.run(`UPDATE Customers SET accountBalance = :balance WHERE id = :cid`, {
        ':balance': balance - price,
        ':cid': cid
    });
}
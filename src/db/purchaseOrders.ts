import { chargeCustomerForPO } from "./customers";
import { connect } from "./db";

export const createPurchaseOrder = async (bid: number, cid: number): Promise<number> => {
    const db = await connect();
    await db.run(`INSERT INTO PurchaseOrders (bookId, customerId, shipped)
     VALUES (:bid, :cid, 0)`, {
        ':bid': bid,
        ':cid': cid
    });
    return getPOIdByContents(bid, cid);
}

export const getPOIdByContents = async (bid: number, cid: number): Promise<number> => {
    const db = await connect();
    let ID = 0;
    await db.each(`SELECT id FROM PurchaseOrders WHERE bookId = :bid AND customerId = :cid`, {
        ':bid': bid,
        ':cid': cid
    }, (err, row) => {
        ID = row.id;
    });
    return ID;
}

export const isPoShipped = async (pid: number): Promise<boolean> => {
    const db = await connect();
    let shipped = 0;
    await db.each(`SELECT shipped FROM PurchaseOrders WHERE id = :pid`, {
        ':pid': pid
    }, (err, row) => {
        shipped = row.shipped;
    });
    return shipped === 1;
}

export const shipPo = async (pid: number): Promise<void> => {
    const db = await connect();
    await chargeCustomerForPO(pid);
    await db.run(`UPDATE PurchaseOrders SET shipped = 1 WHERE id = :pid`, {
        ':pid': pid
    });
}


import { connect } from './db'

export const createBook = async (title: string, author: string, price: number): Promise<number> => {
    const db = await connect();
    try {
        await db.run(`INSERT INTO Books (title, author, price) VALUES (:title, :author, :price)`, {
            ':title': title,
            ':author': author,
            ':price': price
        });
    }
    catch (err) {
        console.log(err);
    }
    return getBookId(title, author)
}

export const getBookId = async (title: string, author: string): Promise<number> => {
    const db = await connect();
    let bookID = 0;
    await db.each(`SELECT id FROM Books WHERE title = :title AND author = :author`, {
        ':title': title,
        ':author': author
    }, (err, row) => {
        bookID = row.id;
    });
    return bookID;
}

export const getBookPrice = async (bid: number): Promise<number> => {
    const db = await connect();
    let bookPrice = 0;
    await db.each(`SELECT price FROM Books WHERE id = :bid`, {
        ':bid': bid
    }, (err, row) => {
        bookPrice = row.price;
    });
    return bookPrice;
}


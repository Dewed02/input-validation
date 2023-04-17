import { connect } from './db'

export const createBook = async (title: string, author: string, price: number): Promise<number> => {
    const db = await connect();
    if (price < 0) {
        throw new Error('Price cannot be negative');
    }
    let existingBook =  await db.get(`SELECT * FROM Books WHERE title = :title AND author = :author`, { 
        ':title': title,
        ':author': author
    });
    if (existingBook) {
        throw new Error('Book already exists');
    }
    await db.run(`INSERT INTO Books (title, author, price) VALUES (:title, :author, :price)`, {
        ':title': title,
        ':author': author,
        ':price': price
    });
    return getBookId(title, author)
}

export const getBookId = async (title: string, author: string): Promise<number> => {
    const db = await connect();
    let bookID = 0;
    await db.each(`SELECT id FROM Books WHERE EXISTS (SELECT 1 FROM Books WHERE title = :title AND author = :author) 
    AND title = :title AND author = :author`, {
        ':title': title,
        ':author': author
    }, (err, row) => {
        bookID = row.id;
    });
    if (bookID === 0) {
        throw new Error('Book not found');
    }
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


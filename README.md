# bookshop-js

A simple book store API in need of input validation/sanitization.

This is a part of the University of Wyoming's Secure Software Design Course (Spring 2023). This is the base repository to be forked and updated for various assignments. Alternative language versions are available in:

- [Go](https://github.com/andey-robins/bookshop-go)
- [Rust](https://github.com/andey-robins/bookshop-rs)

## Versioning

`bookshop-js` is built with:

- node version v16.19.0
- npm version 9.6.2
- nvm version 0.39.3

## Usage

Start the api using `npm run dev`

I recommend using [`httpie`](https://httpie.io) for testing of HTTP endpoints on the terminal. Tutorials are available elsewhere online, and you're free to use whatever tools you deem appropriate for testing your code.

##Analysis of Existing Code

First let's take a look at the code presented from a security point of view. Since authenticaion and authorization are not a concern for potenetial attack vectors, any methods that can be made secure by requiring authentication will have this stated with the assumption that this will be handeld internally by the bookstore or by another devoloper. Looking at the data that is used by this program, the fields that may need some security protcols put into place to ensure a secure environment include, the customers name and address(only when both are present) as well as their balance. Currently, if the database is breached the attacker would have access to the user's name and address as well as the users avaliable balance. From this the attacker could determine whether this user is worth attacking further, either physically or over the internet, based on the amount of money in their account, with the high values presenting great incentive to attack further. Having both their name and address would provide plenty of information for the attacker to further their attack. In order to prevent this all field containging the user's information could be encryted prior to being stored to leave would be attacker in the dark as to what each entery contains. This can be done because the user's name and address have to be entered for most actions, such as checking account balance, updating address, and creating an order, so this entrys can be encyrpted and the ciphers compared to verify that they are the same. For the encryption processs a package such as Advanced Encryption Standard (AES) "https://www.npmjs.com/package/aes-js" could be used to encryped name, address and balance prior to them being inserted into the Customers table. Whenever, this information is needed for other processes, the information can be decyrpted and revealed at that time, such as accessing the user's avialable balance, or address. Outside of these fields the overall security of the program seems to be good, especially after a log, and input validation is added to this program. There are only two methods that have the ability to update information within the database's tables including updateCustomerAddress and shipOrder. To make shipOrder secure, the program could require autheticaiton of the user prior to the user gaining access to the method, and since the book store is in charge of shipping the orders; access to this method should be restricted to store employeess, once again requring some form of authenticaion. This will insure the intergrity of user information as well as order shipment status. Requirement of authentication should also be inforced on methods that reveal the customers personal information, (i.e. balance and address). Outside of the method to create a book in the database which should be restricted to the book store employees it is not necessary to restirct access to any other method. In fact it should be the opposite so that potential customers can easily gain access to information about books being sold at the shop. Finally regarding methods that manage orders, the methods that allow the user to check the status of the order shop require some form of authentication. I imagine the method to check shipment status will be used by the store as it is a redundant method for the users, this being the case this method, the method and the method to ship the orders should be restricted to store employees, especially since the method to ship the order charges the customer for their books. The method to create the order will be avialable to the user, once again this will require authenticaion from the user in some form to make this process secure. Important point to log within this program include creation of a book, customer, and order. As well as when an order has been shipped, when the customers address has been updated, and when the customers balance has been updated. If the need arises all information can be backed up by storing it in an additional storage location such as a hash that used the customers name to store relevant information (i.e. address and balance, and books title to store price and author. Lastly the website should run on https not http, it is very easy to set this up 'import https from 'https';' will be needed then:

const httpsOptions = {
  key: fs.readFileSync('path/to/private/key.pem'),
  cert: fs.readFileSync('path/to/certificate.pem')
};

const server = https.createServer(httpsOptions, app);

will be added to the exisiting code. This greatly improves security and is very easy to set up. 


Moving onto bugs that are present in the code at the moment, first in src/index.ts there should be an additional endpoint 'app.get('/customers/address', handlers.getCustomerAddress);'. As it stands users of the website have the ablilty to update their address but without this endpoint do not have the ability to view their address. Next there needs to be an entire revamp of the way the database queries are handled. At the moment all quires are handled using db.get('SELECT .... WHERE argument1 = ?`, [arguemnt 1]), while this code is syntacticly correct it results in an undefined object being returned. Instead we shoud use db.each(`SELECT ... WHERE argument1 = :argument1) this is because we don't need to wait for the value of argument1 to be passed to look for it in the database table we have it at the time the method is called. This is also true for all methods that insert values into the database tables the use of '?' is unnecessary and will only cause errors and they should be replaced accordingly. Next the get address endpoint currently requires the user to enter the cusomer's ID number, which they may not have, instead the user should be allowed to enter their name in order to get their address(this could cause problems for users with the same name, however if this happens to be the case we can include a username field in the Customers table that must be unique for each user and use that value to accomplish this task). This will require the creation of an additional function 'getCustomerIDbyname' that is the same as the other method to get the customer's ID except it only requires entry of the customer's name instead of name and address. Other than that the method will remain the same. Other methods that should be changed are shipOrder and getOrderStatus; all of these method should require the same input from the user title, author, name, address. This will make it very intutuive for the user to get create an order as well as checking in on relevant order information as the book store processes it. It will also be intutive for an employee at the book store when shipping the order, as they will enter all information relevant to the order they just completed. 

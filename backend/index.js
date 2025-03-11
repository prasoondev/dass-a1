const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./userschema");
const dbConnect = require("./dbconnect");
const jwt = require("jsonwebtoken");
const Item = require("./itemschema");
const Transaction = require("./transactionschema");
const axios = require('axios');
const cors = require("cors");
const Session = require("./sessionschema");
require('dotenv').config()

dbConnect();
const app = express();
const corsOptions = {
  origin: "*",  // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE"],  // Allow all methods
  allowedHeaders: "*",  // Allow all headers
  credentials: false,  // Allow cookies and credentials
  preflightContinue: false,  // Do not allow CORS preflight requests to continue
};

// Apply CORS middleware to all routes
app.use(cors(corsOptions));
app.use(express.json());
const PORT = 3000;

const allowedDomain = /iiit\.ac\.in$/;

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_AUTH);
    return decoded; // Return the decoded token if it's valid
  } catch (err) {
    return null; // Return null if the token is invalid or expired
  }
}

app.get("/protectedroute",(request,response)=>{
  const userId = request.get('userId');
  const token = request.get('token');

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }
  return response.status(200).send({message:"success"});
});

// register endpoint
app.post("/register", (request, response) => {
  if (!allowedDomain.test(request.body.email)) {
    return response.status(400).send({
      message: "Invalid email domain. Only @iiit.ac.in is allowed.",
    });
  }
  // hash the password
  bcrypt
    .hash(request.body.password, 10)
    .then((hashedPassword) => {
      // create a new user instance and collect the data
      const user = new User({
        email: request.body.email,
        password: hashedPassword,
        fname: request.body.fname,
        lname: request.body.lname,
        age: request.body.age,
        contact: request.body.contact,
        items: request.body.items,
        reviews: request.body.reviews,
      });

      // save the new user
      user
        .save()
        // return success if the new user is added to the database successfully
        .then((result) => {
          response.status(201).send({
            message: "User Created Successfully",
            result,
          });
        })
        // catch error if the new user wasn't added successfully to the database
        .catch((error) => {
          response.status(500).send({
            message: "Error creating user",
            error,
          });
        });
    })
    // catch error if the password hash isn't successful
    .catch((e) => {
      response.status(500).send({
        message: "Password was not hashed successfully",
        e,
      });
    });
});

// login endpoint
app.post("/login", async (request, response) => {
  // check if email exists
  const captchaToken=request.body.captchaToken;
  const captchaVerificationURL = `https://www.google.com/recaptcha/api/siteverify`;
  const secretKey = "6LdW7sEqAAAAADtToAxbw8ZyHruj8o-kroBXRmFK";
    const response2 = await axios.post(
      captchaVerificationURL,
      null,
      {
        params: {
          secret: secretKey,
          response: captchaToken,
        },
      }
    );

    const success  = response2.data;
    if (!success) {
      return response.status(400).send({ message: "CAPTCHA verification failed" });
    }
  User.findOne({ email: request.body.email })
    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {

          // check if password matches
          if (!passwordCheck) {
            return response.status(400).send({
              message: "Passwords does not match",
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user.userId,
              userEmail: user.email,
            },
            process.env.JWT_AUTH,
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            message: "Login Successful",
            email: user.email,
            token,
            userId: user.userId,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        message: "Email not found",
        e,
      });
    });
});

app.get("/profile", async (request, response) => {
  const userId = request.get('userId');
  const token = request.get('token');

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }

  try {
    const user = await User.findOne({ userId: userId }); // Assuming you're using Mongoose and have a User model
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    // console.log(user);
    response.json(user);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});

app.put("/profile", async (request, response) => {
  const userId = request.get('userId');
  const token = request.get('token');

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }
  if (!allowedDomain.test(request.body.email)) {
    return response.status(400).json({
      error: "Invalid email domain. Only @iiit.ac.in is allowed.",
    });
  }
  try {
    const user = await User.findOneAndUpdate({ userId: userId }, request.body, { new: true });
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    response.json(user);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});

app.post("/sell", (request, response) => {
  const userId = request.body.userId;
  const token = request.body.token;

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }
  const item = new Item({
    name: request.body.name,
    price: Number(request.body.price),
    description: request.body.description,
    sellerid: request.body.sellerid,
    category: request.body.category,
  });
  item
    .save()
    .then((result) => {
      response.status(201).send({
        message: "Item Created Successfully",
        result,
      });
    })
    // catch error if the new user wasn't added successfully to the database
    .catch((error) => {
      response.status(500).send({
        message: "Error creating item",
        error,
      });
    });
});

app.get("/buy", (request, response) => {
  const userId = request.get('id');
  const token = request.get('token');

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }
  const excludedId = request.get('id');
  Item.find()
    .then((items) => {
      const filteredItems = items.filter((item) => item.sellerid == excludedId);
      response.status(200).send(filteredItems);
    })
    .catch((error) => {
      response.status(500).send({
        message: "Error fetching items",
        error,
      });
    });
});

app.get("/items", async (request, response) => {
  const userId = request.get('userId');
  const token = request.get('token');

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }
  try {
    const itemId = request.get("item");
    // console.log(itemId);
    const item = await Item.findOne({ itemId: itemId });
    if (!item) {
      return response.status(404).send({ message: "Item not found" });
    }
    const seller = await User.findOne({ userId: item.sellerid });
    if (!seller) {
      return response.status(404).send({ message: "Seller not found" });
    }
    const final = {
      item,
      seller: {
        fname: seller.fname,
        lname: seller.lname,
      },
    }
    response.status(200).send(final);
  }
  catch (e) {
    response.status(500).send({
      message: "Error fetching item",
      error: e,
    });
  }
});

app.get("/search", async (request, response) => {
  const userId = request.get('userId');
  const token = request.get('token');

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }
  try {
    const excludedId = request.get('id');
    const search = request.get('search') || "";
    const categoryHeader = request.get('category');
    const selectedCategories = categoryHeader ? JSON.parse(categoryHeader) : [];
    const query = {
      sellerid: { $ne: excludedId },
      ...(search && { name: { $regex: search, $options: "i" } }),
      ...(selectedCategories.length > 0 && { category: { $in: selectedCategories } }),
    };
    const items = await Item.find(query);
    response.status(200).send(items);
  } catch (error) {
    response.status(500).send({
      message: "Error fetching items",
      error,
    });
  }
});

app.post("/items", async (request, response) => {
  const userId = request.get('userId');
  const itemId = request.get('item');
  // const userId = request.get('userId');
  const token = request.get('token');

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }
  if (!userId || !itemId) {
    return response.status(400).json({ error: "Missing userId or item" });
  }
  try {
    const item = await Item.findOne({ itemId: itemId });
    if (!item) {
      return response.status(404).json({ error: "Item not found" });
    }
    if (item.sellerid === userId) {
      return response.status(400).json({ error: "Cannot add your own item to cart" });
    }
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    if (user.items.includes(itemId)) {
      return response.status(400).json({ error: "Item already added" });
    }
    user.items.push(itemId);
    await user.save();
    response.json(user);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});

app.get("/cart", async (request, response) => {
  const userId = request.get('id');
  const token = request.get('token');

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }
  // const userId = request.get('id');
  if (!userId) {
    return response.status(400).json({ error: "Missing userId" });
  }

  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    // Fetch valid items from the database
    const items = await Item.find({ itemId: { $in: user.items } });
    const filteredItems = items.filter(item => item.sellerid !== userId);
    // console.log(filteredItems);
    // console.log(userId);
    // Extract itemIds from the fetched items
    const validItemIds = filteredItems.map(item => item.itemId);

    // Check for invalid items in the user's array
    const invalidItemIds = user.items.filter(itemId => !validItemIds.includes(itemId));

    if (invalidItemIds.length > 0) {
      // Remove invalid items from the user's array
      user.items = user.items.filter(itemId => validItemIds.includes(itemId));
      await user.save();
      const items = await Item.find({ itemId: { $in: user.items } });
      const filteredItems = items.filter(item => item.sellerid !== userId);
      return response.status(200).send(filteredItems);
    }

    return response.status(200).send(filteredItems);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});


app.patch("/cart", async (request, response) => {
  const userId = request.get('id');
  const token = request.get('token');

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }
  // const userId = request.get('id');
  if (!userId) {
    return response.status(400).json({ error: "Missing userId" });
  }
  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    const itemId = request.get('item');
    if (!itemId) {
      return response.status(400).json({ error: "Missing item" });
    }
    const index = user.items.indexOf(itemId);
    if (index === -1) {
      return response.status(404).json({ error: "Item not found" });
    }
    user.items.splice(index, 1);
    await user.save();
    response.json(user);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});

app.delete("/buy", async (request, response) => {
  const userId = request.get('id');
  const token = request.get('token');

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }
  // const userId = request.get('id');
  if (!userId) {
    return response.status(400).json({ error: "Missing userId" });
  }
  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    const itemId = request.get('item');
    if (!itemId) {
      return response.status(400).json({ error: "Missing item" });
    }
    const item = await Item.findOne({ itemId: itemId });
    if (!item) {
      return response.status(404).json({ error: "Item not found" });
    }
    await Item.deleteOne({ itemId: itemId });
    response.status(200).json({ message: "Item successfully deleted from database and user cart." });
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});

app.post("/cart", async (request, response) => {
  const userId = request.get('id');
  const token = request.get('token');

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }
  // const userId = request.get('id');
  if (!userId) {
    return response.status(400).json({ error: "Missing userId" });
  }
  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    const items = await Item.find({ itemId: { $in: user.items } });
    for (const element of items) {
      const seller = await User.findOne({ userId: element.sellerid });
      const otp = Math.floor(100000 + Math.random() * 900000);
      bcrypt
        .hash(otp.toString(), 10)
        .then((hashedOTP) => {
          // create a new user instance and collect the data
          const transaction = new Transaction({
            name: element.name,
            price: element.price,
            description: element.description,
            sellerid: element.sellerid,
            buyerid: userId,
            hashedOTP: hashedOTP,
          });
          transaction
            .save()
            .then((result) => {
              seller.deliver.push(transaction.transactionId);
              seller.save()
                .then((result) => {
                  const buyerpackage = {
                    transactionId: transaction.transactionId,
                    otp: otp.toString(),
                  }
                  user.orderhistory.push(buyerpackage);
                  user.save()
                    .then((result) => {
                      response.status(200).send({
                        message: "Transaction created successfully",
                        result,
                      });
                    })
                    .catch((error) => {
                      response.status(500).send({
                        message: "Error updating buyer",
                        error,
                      });
                    });
                })
                .catch((error) => {
                  response.status(500).send({
                    message: "Error updating seller",
                    error,
                  });
                });
            })
            .catch((error) => {
              response.status(500).send({
                message: "Error creating transaction",
                error,
              });
            });
        });
    }
    for (const element of items) {
      await Item.deleteOne({ itemId: element.itemId });
    }
    user.items = [];
    await user.save();
    response.status(200).json({ message: "Checkout successful" });
  }
  catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});

app.get("/deliver", async (request, response) => {
  // response.status(200).send("Delivery endpoint");
  const userId = request.get('id');
  const token = request.get('token');

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }
  // const userId = request.get('id');
  if (!userId) {
    return response.status(400).json({ error: "Missing userId" });
  }
  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    const transactions = await Transaction.find({ transactionId: { $in: user.deliver } });
    for (const element of transactions) {
      const buyer = await User.findOne({ userId: element.buyerid });
      element.buyerid = buyer ? buyer.fname + " " + buyer.lname : "Unknown Buyer";
    }
    response.status(200).json(transactions);
  }
  catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});

app.get("/orders", async (request, response) => {
  // response.status(200).send("Delivery endpoint");
  const userId = request.get('id');
  const token = request.get('token');

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }
  // const userId = request.get('id');
  if (!userId) {
    return response.status(400).json({ error: "Missing userId" });
  }
  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    // console.log(user);
    const transactionIds = user.orderhistory.map(order => order.transactionId);
    const transactions = await Transaction.find({ transactionId: { $in: transactionIds } });
    for (const element of transactions) {
      const seller = await User.findOne({ userId: element.sellerid });
      element.sellername = seller.fname + " " + seller.lname;
      const buyer = await User.findOne({ userId: element.buyerid });
      element.buyername = buyer.fname + " " + buyer.lname;
      for(const package of user.orderhistory){
        if(package.transactionId == element.transactionId){
          element.hashedOTP = package.otp;
        }
      }
    }
    response.status(200).json(transactions);
  }
  catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});

app.put("/orders", async (request, response) => {
  // response.status(200).send("Delivery endpoint");
  const userId = request.get('id');
  // const userId = request.get('userId');
  const token = request.get('token');

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }
  if (!userId) {
    return response.status(400).json({ error: "Missing userId" });
  }
  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    const target= request.get('transaction');
    const transactionold = await Transaction.findOne({transactionId: target});
    if(!transactionold){
      return response.status(404).json({ error: "Transaction not found" });
    }
    console.log(transactionold);
    const otp = Math.floor(100000 + Math.random() * 900000);
    try{
      const hashedOTP = await bcrypt.hash(otp.toString(), 10);
      transactionold.hashedOTP = hashedOTP; 
      console.log("Hashed OTP:", hashedOTP);
      await transactionold.save();
      for(const package of user.orderhistory){
        if(package.transactionId==target){
          package.otp=otp.toString();
        }
      }
      user.markModified('orderhistory');
      await user.save();
    // console.log(user);
      return response.status(200).json({ message: "Transaction completed successfully" });
    }
    catch(err){
      console.error(err);
      return response.status(500).json({ error: "Server error" });
    }
    response.status(200).json(transactionold);
  }
  catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});

app.post("/transaction", async (request, response) => {
  const userId = request.get('uid');
  const token = request.get('token');

  if (!userId || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== userId) {
    return response.status(403).json({ error: "User not authorized" });
  }
  // const userId = request.get('uid');
  if (!userId) {
    return response.status(400).json({ error: "Missing userId" });
  }
  try {
    const user = await User.findOne({userId: userId});
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    const transactionId = request.get('transactionId');
    console.log(transactionId);
    const otp = request.get('otp');
    const transaction = await Transaction.findOne({ transactionId: transactionId });
    console.log(transaction);
    if (!transaction) {
      return response.status(404).json({ error: "Transaction not found" });
    }
    const seller = await User.findOne({ userId: transaction.sellerid });
    if (!seller) {
      return response.status(404).json({ error: "Seller not found" });
    }
    if (seller.userId !== userId) {
      return response.status(403).json({ error: "User not authorized" });
    }
    const otpMatch = await bcrypt.compare(otp, transaction.hashedOTP);
    if (!otpMatch) {
      return response.status(400).json({ error: "Invalid OTP" });
    }
    transaction.status = "delivered";
    await transaction.save();
    const buyerpackage = {
      transactionId: transaction.transactionId,
      otp: '000000',
    }
    user.orderhistory.push(buyerpackage);
    user.deliver = user.deliver.filter((id) => id !== transactionId);
    await user.save();
    response.status(200).json({ message: "Transaction completed successfully" });
  }
  catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});

app.get("/review",async(request, response) =>{
  const id=request.get('id');
  const token = request.get('token');

  if (!id || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== id) {
    return response.status(403).json({ error: "User not authorized" });
  }
  const userId=request.get('user');
  if (!userId||!id) {
    return response.status(400).json({ error: "Missing userId" });
  }
  try {
    const user = await User.findOne({userId: userId});
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    if(userId==id){
      return response.status(400).json({ error: "Unauthorized" });
    }
    response.status(200).json(user);
  }
  catch (err){
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});

app.post("/review",async(request,response)=>{
  const id=request.get('userId');
  const token = request.get('token');

  if (!id || !token) {
    return response.status(400).json({ error: "Missing userId or token" });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return response.status(401).json({ error: "Invalid or expired token" });
  }
  if (decodedToken.userId !== id) {
    return response.status(403).json({ error: "User not authorized" });
  }
  const userId=request.get('user');
  if (!userId) {
    return response.status(400).json({ error: "Missing userId" });
  }
  try {
    const user = await User.findOne({userId: userId});
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    const review=request.get('review');
    if (!review||review=='') {
      return response.status(400).json({ error: "Missing review" });
    }
    user.reviews.push(review);
    await user.save();
    console.log(review);
    response.status(200).json(review);
  }
  catch (err){
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});
app.get("/support", async (req, res) => {
  try {
    const sessionId = `session_${Date.now()}`;
    // console.log(sessionId);
    const newSession = new Session({ sessionId, messages: [] });
    await newSession.save();
    res.json({ sessionId });
  } catch (error) {
    console.error("Error starting session:", error);
    res.status(500).json({ error: "Failed to start session" });
  }
});
app.post("/support", async (request, res) => {
  const sessionId=request.get("sessionId");
  const message=request.get("message");
  if (!sessionId || !message) {
    return res.status(400).json({ error: "Session ID and message are required" });
  }
  try {
    let session = await Session.findOne({ sessionId });
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    session.messages.push({ role: "user", content: message });
    // const botReply = "Hello";
    const apiKey = process.env.GEMINI; // Replace with your actual API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const response = await axios.post(
        apiUrl,
        {
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    
      // Log the full response for debugging
      console.log("API Response:", response.data);
    
      console.log("API Response:", JSON.stringify(response.data, null, 2));

  const botReply =
    response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I couldn't generate a response.";

  console.log("Bot Reply:", botReply);
    
    session.messages.push({ role: 'bot', content: botReply });
    await session.save();
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error handling chat message:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

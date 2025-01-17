const mongoose = require("mongoose");
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./userschema");
const dbConnect = require("./dbconnect");
const jwt = require("jsonwebtoken");
const Item = require("./itemschema");
require('dotenv').config()

dbConnect();
const app = express();
const cors = require("cors");
app.use(cors());
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
app.post("/login", (request, response) => {
  // check if email exists
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
    return response.status(400).send({
      message: "Invalid email domain. Only @iiit.ac.in is allowed.",
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
  if (!userId || !itemId) {
    return response.status(400).json({ error: "Missing userId or item" });
  }
  try {
    const item = await Item.findOne({ itemId: itemId });
    if (!item) {
      return response.status(404).json({ error: "Item not found" });
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
  if (!userId) {
    return response.status(400).json({ error: "Missing userId" });
  }
  try {
    const user = await User.findOne({ userId: userId });
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }
    const items = await Item.find({ itemId: { $in: user.items } });
    response.status(200).send(items);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: "Server error" });
  }
});

app.patch("/cart", async (request, response) => {
  const userId = request.get('id');
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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

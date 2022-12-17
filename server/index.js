const express = require("express");
const cors = require("cors"); // cors package prevents CORS errors when using client side API calls
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const uri =
  "mongodb+srv://kevinlinpt:kevinlin1998@cluster0.civvwk4.mongodb.net/?retryWrites=true&w=majority"; // unique identifier

const app = express();
const PORT = process.env.PORT || 8080;

// Require .env files for environment variables (keys and secrets)
require("dotenv").config();

app.use(cors());

app.get("/", (req, res) => {
  return res.json("Hello World!");
});

// receive signup info from front-end, generate data to be send to MongoDB
app.post("/signup", async (req, res) => {
  const client = new MongoClient(uri);

  const { email, password } = req.body;

  const generatedUserId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const existingUser = users.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .send("user already exists. Please login with a different account");
    }

    const sanitizedEmail = email.toLowerCase();

    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword,
    };

    const insertedUser = await users.insertOne(data);
    const token = jwt.sign(insertedUser, sanitizedEmail, {
      expiresIn: "1d",
    });

    // return res.redirect("signup_success.html");
  } finally {
    client.close();
  }
});

// retrieve data for user
app.get("/users", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    // turn users obj to array
    const returnedUsers = await users.find().toArray();
    console.log(returnedUsers);
    res.send(returnedUsers);
  } catch (error) {
    console.log(error);
  } finally {
    // run regardless of try result
    await client.close();
  }
});

// retrieve data for user's dog
app.get("/dogs", async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const dogs = database.collection("dogs");

    // turn dogs obj to array
    const returnedDogs = await dogs.find().toArray();
    console.log(returnedDogs);
    res.send(returnedDogs);
  } catch (error) {
    console.log(error);
  } finally {
    // run regardless of try result
    await client.close();
  }
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}!`));

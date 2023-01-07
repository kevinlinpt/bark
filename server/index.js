// Require .env files for environment variables (keys and secrets)
require("dotenv").config();

const express = require("express");
const cors = require("cors"); // cors package prevents CORS errors when using client side API calls
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

// unique identifier
const uri = process.env.URI;

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.json("Welcome to my app!");
});

// Signup to the database: generate data to send to MongoDB after receiving signup info from front-end
app.post("/signup", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;
  const generatedUserId = uuidv4(); // generate random id
  const hashedPassword = await bcrypt.hash(password, 10); // hash user password

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .send("user already exists. Please login with a different account");
    }

    // user sign-up data
    const sanitizedEmail = email.toLowerCase();
    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword,
    };

    // insert sign-up data in db collection
    const insertedUser = await users.insertOne(data);
    const token = jwt.sign(insertedUser, sanitizedEmail, {
      expiresIn: "1d",
    });
    // send token and user id to front-end
    res.status(201).json({ token, userId: generatedUserId });
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

// Login to the database: send request to allow for user login
app.post("/login", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    const existingUser = await users.findOne({ email });
    const correctPassword = await bcrypt.compare(
      password,
      existingUser.hashed_password
    );
    // check if password and hashed password match
    if (existingUser && correctPassword) {
      const token = jwt.sign(existingUser, email, {
        expiresIn: "1d",
      });
      // send token and user id to front-end
      res.status(201).json({ token, userId: existingUser.user_id });
    }
    res.status(400).send("Invalid credentials, please try again.");
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

// Retrieve data for ALL matched users by userIds from database
app.get("/users", async (req, res) => {
  const client = new MongoClient(uri);
  const userIds = JSON.parse(req.query.userIds); // array of all user ids you matched with

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    // create pipeline to find all documents of user ids you matched with
    const pipeline = [
      {
        $match: {
          // equality match
          user_id: {
            $in: userIds,
          },
        },
      },
    ];

    const foundUsers = await users.aggregate(pipeline).toArray(); // array of objects of all users that you matched with
    res.json(foundUsers); // send JSON response to endpoint
  } finally {
    await client.close();
  }
});

// Get users by gender
app.get("/gendered-users", async (req, res) => {
  const client = new MongoClient(uri);
  const gender_identity = req.query.gender;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    const query = { gender: { $eq: gender_identity } };
    const foundUsers = await users.find(query).toArray();
    res.json(foundUsers);
  } finally {
    await client.close();
  }
});

// Retrieve data for one user from db
app.get("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.query.userId;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    // query user based on userId and find user in database
    const query = { user_id: userId };
    const user = await users.findOne(query);
    res.send(user);
  } finally {
    await client.close();
  }
});

// Update user data after submission of onboarding info
app.put("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const formData = req.body.formData;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    // query user id
    const query = { user_id: formData.user_id };

    // retrieve user onboarding info from onboarding page formData
    const updateDocument = {
      $set: {
        first_name: formData.first_name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        show_gender: formData.show_gender,
        gender: formData.gender,
        gender_interest: formData.gender_interest,
        url_1: formData.url_1,
        about_me: formData.about_me,
        matches: formData.matches,
      },
    };
    const insertedUser = await users.updateOne(query, updateDocument);
    res.json(insertedUser);
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

// Update user matches array with new matched user using matchedUserId
app.put("/addmatch", async (req, res) => {
  const client = new MongoClient(uri);
  const { userId, matchedUserId } = req.body;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const query = { user_id: userId };
    const updateDocument = {
      $push: { matches: { user_id: matchedUserId } },
    };
    const user = await users.updateOne(query, updateDocument);
    res.send(user);
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

// Get all messages sent by user
app.get("/messages", async (req, res) => {
  const client = new MongoClient(uri);
  const { userId, correspondingUserId } = req.query;
  console.log(userId, correspondingUserId);

  try {
    await client.connect();
    const database = client.db("app-data");
    const messages = database.collection("messages");

    const query = { from_userId: userId, to_userId: correspondingUserId }; // match db from_UserId and to_userId with ids passed from client
    const foundMessages = await messages.find(query).toArray();
    res.send(foundMessages);
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

// Post a single message from user
app.post("/message", async (req, res) => {
  const client = new MongoClient(uri);
  const message = req.body.message;

  try {
    await client.connect();
    const database = client.db("app-data");
    const messages = database.collection("messages");
    const insertedMessage = await messages.insertOne(message);
    res.send(insertedMessage);
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}!`));

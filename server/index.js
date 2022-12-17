const express = require("express");
const cors = require("cors"); // cors package prevents CORS errors when using client side API calls
const bcrypt = require("bcrypt");
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
app.use(express.json());

app.get("/", (req, res) => {
  return res.json("Hello World!");
});

// generate data to send to MongoDB after receiving signup info from front-end
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
  }
});

// send request to allow for user login
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
  }
});

// retrieve data for all users
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

// retrieve data for all dogs
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

// update user data after submission of onboarding info
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
        url_1: formData.url_1,
        about_me: formData.about_me,
        matches: formData.matches,
      },
    };
    const insertedUser = await users.updateOne(query, updateDocument);
    res.json(insertedUser)
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}!`));

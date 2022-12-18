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

// retrieve data for all users from db
app.get('/users', async (req, res) => {
  const client = new MongoClient(uri)
  const userIds = JSON.parse(req.query.userIds)

  try {
      await client.connect()
      const database = client.db('app-data')
      const users = database.collection('users')

      const pipeline =
          [
              {
                  '$match': {
                      'user_id': {
                          '$in': userIds
                      }
                  }
              }
          ]

      const foundUsers = await users.aggregate(pipeline).toArray()

      res.json(foundUsers)

  } finally {
      await client.close()
  }
})

// get users by gender
app.get('/gendered-users', async (req, res) => {
  const client = new MongoClient(uri)
  const gender_identity = req.query.gender

  try {
      await client.connect()
      const database = client.db('app-data')
      const users = database.collection('users')
      const query = {gender: {$eq: gender_identity}}
      const foundUsers = await users.find(query).toArray()
      res.json(foundUsers)

  } finally {
      await client.close()
  }
})

// retrieve data for one user from db
app.get("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.query.userId;

  console.log("userid", userId);

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

// retrieve data for all dogs from db
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

// update user matches array with new matched user using matchedUserId
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

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}!`));

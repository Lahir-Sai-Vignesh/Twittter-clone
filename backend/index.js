import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from 'mongodb';
import nodemailer from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const otpStorage = {}; // In-memory storage for OTPs, for simplicity. Use a database in production.

async function run() {
  try {
    await client.connect();
    const postCollection = client.db('database').collection("Posts");
    const userCollection = client.db('database').collection("Users");

    app.get('/user', async (req, res) => {
      try {
        const users = await userCollection.find().toArray();
        res.send(users);
      } catch (error) {
        res.status(500).send("Error fetching users");
      }
    });

    app.get('/loggedInUser', async (req, res) => {
      const email = req.query.email;
      try {
        const user = await userCollection.find({ email: email }).toArray();
        res.send(user);
      } catch (error) {
        res.status(500).send("Error fetching logged in user");
      }
    });

    app.get('/post', async (req, res) => {
      try {
        const posts = await postCollection.find().toArray();
        res.send(posts.reverse());
      } catch (error) {
        res.status(500).send("Error fetching posts");
      }
    });

    app.get('/userPost', async (req, res) => {
      const email = req.query.email;
      //console.log(email)
      try {
        const posts = await postCollection.find({'userPost.email':email}).toArray();
        res.send(posts.reverse());
      } catch (error) {
        res.status(500).send("Error fetching posts");
      }
    });

    app.post('/send-otp', async (req, res) => {
      const { email } = req.body;
      const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
      otpStorage[email] = otp;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send('Error sending OTP');
        }
        res.status(200).send('OTP sent');
      });
    });

    app.post('/verify-otp', (req, res) => {
      const { email, otp } = req.body;

      if (otpStorage[email] && otpStorage[email] === parseInt(otp)) {
        delete otpStorage[email]; // OTP verified, remove from storage
        res.status(200).send('OTP verified');
      } else {
        res.status(400).send('Invalid OTP');
      }
    });

    app.post("/post", async (req, res) => {
      const post = req.body;
      try {
        const result = await postCollection.insertOne(post);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error creating post");
      }
    });

    app.post("/register", async (req, res) => {
      const user = req.body;
      try {
        const result = await userCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        res.status(500).send("Error registering user");
      }
    });

    app.patch('/userUpdates/:email', async (req, res) => {
      const filter = req.params;
      const profile = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: profile };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result)
  });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.listen(PORT, () => {
  console.log(`Server Listening on Port ${PORT}`);
});

import express from "express";
import cors from "cors";
import { MongoClient, ServerApiVersion } from 'mongodb';


const app = express();
const PORT = process.env.PORT||5000;

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://Lahir:Kpzh6aFV8ySuWOXM@twitter-clone.ommfkwr.mongodb.net/?retryWrites=true&w=majority&appName=Twitter-clone";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const postCollection = client.db('database').collection("Posts");
    const userCollection = client.db('database').collection("Users");

    app.get("/post",async(req,res)=>{
      const post = await postCollection.find().toArray();
      res.send(post)
    });

    app.get("/user",async(req,res)=>{
      const user = await postCollection.find().toArray();
      res.send(user)
    });

    app.get('/loggedInUser', async (req, res) => {
      const email = req.query.email;
      const user = await userCollection.find({ email: email }).toArray();
      res.send(user);
  })
    
    app.post("/post",async(req,res)=>{
      const post = req.body;
      const result = await postCollection.insertOne(post);
      res.send(result);
    });

    app.post("/register",async(req,res)=>{
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
  } catch(error) {
    console.log(error);
  }
}
run().catch(console.dir);


app.get("/",(req,res)=>{
    res.send("Home Page")
});

app.listen(PORT,()=>{
    console.log(`Server Listening on Port ${PORT}`)
})
//creating server using express and connecting it to mongoDB database

const express = require("express");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectID;
const { MongoClient } = require("mongodb");

//doc-app-db is the name of the database stored in mongoDB
const database = "doc-app-db";

//connection string to connect to the database
const url =
  "mongodb+srv://doc-app-user:solGBrNMBiMuVRPs@cluster0.nu3rdn2.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url);
const app = express();
app.use(express.json());
app.use(cors());

let result = null;
let db = null;
let collection = null;

//connecting to database
async function connectDB() {
  try {
    result = await client.connect();

    db = result.db(database);

    collection = db.collection("appointments-collection");

    console.log("Database Connected ");
  } catch (err) {
    console.log(`DB Error : ${err}`);
  }
}

//initializing the server
app.listen(3001, () => {
  console.log("Server Started");
  connectDB();
});

//api to get all appointments

app.get("/get", async (req, res) => {
  response = await collection.find({}).toArray();

  res.send(response);
});

//api to add appointment

app.post("/add", async (req, res) => {
  const { title, start, end } = req.body;
  await collection.insertOne({
    title: title,
    start: start,
    end: end,
  });
  res.status(200);
  res.send("Appointment Added Successfully");
});

//api to update appointment on drag&drop

app.post("/update", async (req, res) => {
  const { id, start } = req.body;

  await collection.updateOne(
    { _id: new ObjectId({ id }) },
    { $set: { start: start, end: null } }
  );
  res.status(200);
  res.send("Appointment Updated Successfully");
});

//api to update appointment on resize

app.post("/updateSize", async (req, res) => {
  const { id, start, end } = req.body;

  await collection.updateOne(
    { _id: new ObjectId({ id }) },
    { $set: { start: start, end: end } }
  );
  res.status(200);
  res.send("Appointment Updated Successfully");
});

//api to delete appointment

app.post("/delete", async (req, res) => {
  const { id } = req.body;
  await collection.deleteOne({ _id: new ObjectId({ id }) });
  res.status(200);
  res.send("Appointment Deleted Successfully");
});

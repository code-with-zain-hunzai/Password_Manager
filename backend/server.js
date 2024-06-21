const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser')
const cors = require('cors')

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'PassOP';
const app = express();
const port = 3000;
app.use(bodyparser.json())
app.use(cors())

async function main() {
  // Connect to the MongoDB client
  await client.connect();
  console.log('Connected successfully to MongoDB server');

  const db = client.db(dbName);

  // get all the password
  app.get('/', async (req, res) => {
    const collection = db.collection('password');
    const filteredDocs = await collection.find({}).toArray();
    res.json(filteredDocs);
  });

  //save a password
  app.post('/', async (req, res) => {
    const password = req.body
    const collection = db.collection('password');
    const filteredDocs = await collection.insertOne(password);
    res.send({ success: true, Docs: filteredDocs });
  });

  // password deleted by id
  app.delete('/:id', async (req, res) => {
    const password = req.body
    const collection = db.collection('password');
    const filteredDocs = await collection.deleteOne(password);
    res.send({ success: true, Docs: filteredDocs });
  });

  app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}`);
  });
}

main().catch(console.error);

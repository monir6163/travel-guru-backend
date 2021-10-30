const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

// database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r1nyd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// backend work 
async function run() {
    try {
        await client.connect();
        const database = client.db('travelguru');
        const packageCollection = database.collection('packages');
        const packageBookCollection = database.collection('packageBook');

        // get all package
        app.get('/allPackages', async (req, res) => {
            const package = packageCollection.find({});
            const result = await package.toArray();
            res.send(result);
        });
        // post api 
        app.post('/allPackages', async (req, res) => {
            const package = req.body;
            const result = await packageCollection.insertOne(package);
            res.json(result)
        });
        // orders api 
        app.get('/orders/:bookid', async (req, res) => {
            const id = req.params.bookid;
            const query = { _id: ObjectId(id) };
            const order = await packageCollection.findOne(query);
            res.send(order);
        });
        // package book api 
        app.post('/placeorders', async (req, res) => {
            const packageBook = req.body;
            const result = await packageBookCollection.insertOne(packageBook);
            res.json(result)
        });
        app.get('/placeorders', async (req, res) => {
            const cursor = packageBookCollection.find({});
            const services = await cursor.toArray();
            res.json(services);
        });
        // get my orders
        app.get("/myorders/:email", async (req, res) => {
            const result = await packageBookCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });
        // delete api 
        app.delete("/deleteorder/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await packageBookCollection.deleteOne(query);
            res.json(result);
        });
        // delete all order 
        app.delete("/deleteallorder/:id", async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await packageBookCollection.deleteOne(query);
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

// default api check run server
app.get('/', (req, res) => {
    res.send('Running Node Servers')
});
app.listen(port, () => {
    console.log('Travel guru port', port)
})
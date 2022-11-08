const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000;

// middlewares
app.use(cors())
app.use(express.json())


// mongodb 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.PASSWORD}@cluster0.17kk4sr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('Fitness-Cube').collection('services')

        // get services from db
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })


    }
    finally {

    }
}

run().catch(err => console.error(err))


app.get("/", (req, res) => {
    res.send('server is running')
})


app.listen(port, () => {
    console.log('The server is running on port', port)
})
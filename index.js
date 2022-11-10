const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        // mongodb collection
        const serviceCollection = client.db('Fitness-Cube').collection('services')
        const reviewCollevtion = client.db('Fitness-Cube').collection('reviews')


        // get 3 services from db
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })

        // get all services form db
        app.get('/services_all', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })

        // get speific service form db
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        // get review for specific id from db
        app.get('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { serviceId: id }
            const cursor = reviewCollevtion.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // get my review by email query 
        app.get('/my_review', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const cursor = reviewCollevtion.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })

        // delete my review by query email
        app.delete('/my_review', async (req, res) => {
            let query = {}
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const result = await reviewCollevtion.deleteOne(query)
            res.send(result)
        })

        // post review inside db
        app.post('/review', async (req, res) => {
            const reviewInfo = req.body;
            const review = await reviewCollevtion.insertOne(reviewInfo)
            res.send(review)
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
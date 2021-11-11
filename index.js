const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
require('dotenv').config()
const ObjectId=require('mongodb').ObjectId
const cors=require('cors')
const port =process.env.PORT|| 5000
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lreh2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run(){
    try{
        await client.connect();
        const database = client.db("rolls-royce");
        const brandNewCollection = database.collection("cars-stor");
        const shippingCollection=database.collection("shipping")

        // get api
        app.get('/cars',async(req,res)=>{
            const cursor= brandNewCollection.find({})
            const result=await cursor.toArray()
            res.json(result)
        })
        app.get('/cars/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const product=await brandNewCollection.findOne(query)
          
            res.send(product)
        })
         
        app.get('/myOrder',async(req,res)=>{
            const email=req.query.email;
            const query={email:email}
            const cursor =shippingCollection.find(query)
            const result=await cursor.toArray()
            res.json(result)

        })

        //post 
        app.post('/shiping',async(req,res)=>{
            const use=req.body
            const result= await shippingCollection.insertOne(use);
            res.json(result)
            console.log(result)
          
        })

    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);




app.get('/',(req,res)=>{
    console.log("server site run")
    res.send("it is running")
})
app.listen(port,()=>{
    console.log("local host ",port)
})
const express = require('express');
const { MongoClient, ServerApiVersion,ObjectId, MongoRuntimeError } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000 ;
const { ObjectID } = require('bson');


app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krrcpvz.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// suro
 async function run(){

    try{
        await client.connect();
        console.log('database connected ')
        const foodCollection =client.db('food_receipe').collection('foods')
        
        app.post('/foods',async(req,res)=>{
          const newfood  =req.body;
          const result =await foodCollection.insertOne(newfood);
          res.send(result);
       })




       app.get('/food/:id',async(req,res)=>{
        const id =req.params.id;
        const query ={_id:ObjectID(id)};
        const result=await foodCollection.findOne(query);
        res.send(result);

     });

      

       //delete 
       app.delete('/food/:id',async(req,res)=>{
        const id=req.params.id;
        const query ={_id:ObjectID(id)}
        const result =await foodCollection.deleteOne(query);
        res.send(result);
    })


    // update
    app.put('/food/:id' ,async(req,res) =>{
      const id = req.params.id;
      const updateQuantity = req.body;
      const delivery = updateQuantity.quantity -1;
      const filter = {_id:ObjectId(id)}
      const option = { upsert : true}
      const updateDoc ={
        $set:{
        
          quantity : delivery
        
        }
      }
      const result = await foodCollection.updateOne(filter,updateDoc,option);
      res.send(result);
    })

        app.get('/foods',async(req,res)=>{
            const query ={} ;
            const cursor =foodCollection.find(query) ;
            const foods =await cursor.toArray();
            res.send(foods)

        })
    }
    finally{

    }

}
run().catch(console.dir);

// ses


app.get('/', (req, res) => {
  res.send('Hello from food receipe!')
})

app.listen(port, () => {
  console.log(`Food receipe app listening on port ${port}`)
})
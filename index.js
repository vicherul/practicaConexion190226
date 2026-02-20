// Importamos las dependencias necesarias
import dotenv from 'dotenv'
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
import express from 'express'

dotenv.config();

const app = express();
const PORT = 3000;

const uri = process.env.MONGO_DB_URI

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors:true
    }
})

// GET - OBTENER DATOS

app.get('/post', async (req, res) => {
    try {
        await client.connect();
    const database = client.db("craft_beer")
    const posts = database.collection("beer")
    const list = await posts.find({}).toArray();
    res.json({success: true, data: list})
    } catch (error) {
        res.status(500).json({success: false, error: error.message })
    }finally{
        await client.close();
    }
})

// POST - CREAR DATOS

app.post('/post', express.json(), async (req, res) =>{
    try {
        await client.connect();
        const database = client.db("craft_beer")
        const posts = database.collection("beer")
        const result = await posts.insertOne(req.body)
        res.json({success: true, insertedId: result.insertedId})
    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }finally{
        await client.close();
    }
} )

// UPDATE - ACTUALIZAR DATOS

app.put('/post/:id', express.json(), async (req, res)=> {
    try {
        await client.connect();
        const database = client.db("craft_beer");
        const posts = database.collection("beer");

        const result = await posts.updateOne(
            { _id: new ObjectId(req.params.id)},
            { $set: req.body }
        );
        
        if(result.matchedCount === 0){
            res.status(404).json({success: false, message: "Producto no encontrado, vayase de vacaciones"})
        }else{
            res.json({success: true, message: "Se actualizo el registro", modifiedCount: result.modifiedCount})
        }


    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }finally{
        await client.close();
    }
})

// DELETE - ELIMINAR DATOS

app.delete('/post/:id', async(req, res) => {
   try {
     await client.connect();
    const database = client.db("craft_beer");
    const posts = database.collection("beer");

    const result = await posts.deleteOne({
        _id: new ObjectId(req.params.id)
    })

    if (result.deletedCount === 0) {
        res.status(404).json({success: true, message: "Registro no encontrado, vayase señor Cuesta"})
    }else{
        res.json({ success: true, message: "Registro Elimiinado", deletedCount: result.deletedCount})
    }
   } catch (error) {
    res.status(500).json({success: false, error: error.message })
   }finally{
     await client.close();
   }

})

app.listen(PORT, () => {
    console.log(`Servidor corriendo el http://localhost:${PORT}`)
})


import { MongoClient } from "mongodb";
import dotenv from "dotenv"
dotenv.config()
import express from "express"
const collectionRoute = express.Router()


const URL = process.env.MONGO_URL
const database = process.env.MONGO_DATABASE

collectionRoute.post('/create-collection', async (req, res) => {
    const { collection } = req.body;
    const client = await MongoClient.connect(URL);
    const db = client.db(database);

    try {
        // create the collection
        await db.createCollection(collection);
        console.log(`Collection '${collection}' created successfully.`);
        res.status(201).json({
            success: true,
            message: `Collection '${collection}' created successfully.`,
        });
    } catch (error) {
        if (error.code === 48) {

            console.log(`Collection '${collection}' already exists.`);
            res.status(409).json({
                success: false,
                message: `Collection '${collection}' already exists.`,
            });
        } else {
            console.error('Error creating collection:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    } finally {
        client.close();
    }
})
export default collectionRoute;
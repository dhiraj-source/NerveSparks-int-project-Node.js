import { MongoClient } from "mongodb";
import "colors"
import dotenv from "dotenv"
dotenv.config()

const URL = process.env.MONGO_URL
const database = process.env.MONGO_DATABASE

const client = new MongoClient(URL, { useNewUrlParser: true })

const connectDB = async () => {
    try {
        let result = await client.connect()
        let db = result.db(database)
        console.log(`database connected`.bgGreen.white)

        // REALTIONSHIPS AMONG COLLECTIONS
        db.collection('user').createIndex({ vehicle_info: 1 });
        db.collection('sold_vehicles').createIndex({ vehicle_id: 1 });
        db.collection('dealership').createIndex({ deals: 1 });
        db.collection('dealership').createIndex({ cars: 1 });
        db.collection('dealership').createIndex({ sold_vehicles: 1 });
        db.collection('deal').createIndex({ car_id: 1 });
        db.collection('cars').createIndex({ car_id: 1 });

        console.log(`Relationships established`.bgMagenta.white);

        return db

    } catch (error) {
        console.log(`error while connecting`.bgRed.white, error)
    }
}

export default connectDB
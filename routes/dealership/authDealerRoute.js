import express from "express";
import connectDB from "../../config/db.js";
import JWT from "jsonwebtoken"
import { dealerAuthMiddleware } from "../../middleware/dealerAuthMiddleware.js"
import { ObjectId } from "mongodb";
import { faker } from "@faker-js/faker"

function generateRandomId() {
    const newId = faker.string.uuid()

    return newId
}


const dealershipRouter = express.Router()

// DEALERSHIP LOGIN || POST

dealershipRouter.post('/auth/login', async (req, res) => {
    const { dealership_email, password } = req.body

    // dealership collection  connection
    const content = await connectDB()
    const data = content.collection('dealership')

    try {
        if (!dealership_email || !password) {
            res.status(401).json({ status: false, message: "enter dealership mial and passwword" })
        }
        // finding dealership with email 
        let dealership = await data.findOne({ dealership_email })
        if (!dealership || dealership.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        //hiding password in response
        const { password: dealershipPassword, ...dealershipWithoutPassword } = dealership;

        //creating JSONTOKEN
        const token = JWT.sign({ dealershipId: dealership._id }, process.env.SECRET_KEY, { expiresIn: '1d' });


        res.status(200).json({
            succes: true,
            message: "login successfully",
            dealership: dealershipWithoutPassword,
            token
        })

    } catch (error) {
        res.status(401).json({
            status: false,
            message: " dealership login failed",
            error
        })
    }
})



// DEALERSHIP PIPELINE
const dealerPipeline = (projection, matching) => {
    const pipline = [
        {
            $lookup: {
                from: "deal",
                localField: "deals",
                foreignField: "deal_id",
                as: "joined_deals"
            }
        },
        {
            $lookup: {
                from: "cars",
                localField: "cars",
                foreignField: "car_id",
                as: "joined_dealership_cars"
            }
        },
        {
            $lookup: {
                from: "sold_vehicles",
                localField: "sold_vehicles",
                foreignField: "vehicle_id",
                as: "joined_dealership_sold_vehicles"
            }
        }
    ]
    if (projection) {
        pipline.push({ $project: projection })
    }
    if (matching) {
        pipline.push({ $match: matching })
    }

    return pipline
}


//VIEW ALL CARS || GET
dealershipRouter.get("/all-cars", dealerAuthMiddleware, async (req, res) => {
    try {
        const projection = {
            "_id": 0,
            "type": 1,
            "name": 1,
            "model": 1,
            "car_info": 1,
            "car_id": 1
        }

        const pipline = dealerPipeline(projection)
        const content = await connectDB()
        const cars = await content.collection('cars').aggregate(pipline).toArray();
        res.status(200).json({
            status: true,
            message: "succesfully fetch cars",
            cars
        });
    } catch (err) {
        console.error('Error fetching car data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


//TO VIEW ALL CARS SOLD BY DEALERSHIP || GET

dealershipRouter.get("/dealer-sold-vehicles-cars", dealerAuthMiddleware, async (req, res) => {
    const dealerId = req.dealer.dealershipId
    const objectIddealershipId = new ObjectId(dealerId)

    const content = await connectDB()
    try {
        const dealership = await content.collection('dealership').findOne({ _id: objectIddealershipId })
        if (!dealership) {
            return res.status(401).json({ message: "DealerShio not Found" });
        }
        const soldVehiclesIds = dealership.sold_vehicles

        const soldVehicle = await content.collection("sold_vehicles").find({ vehicle_id: { $in: soldVehiclesIds } }).toArray()

        const carIds = soldVehicle.map(carId => carId.car_id)

        const dealerSoldVehicleInCars = await content.collection('cars').find({ car_id: { $in: carIds } }).toArray()

        // const dealerSoldVehicles = [{ "dealerSoldVehicleInCars": dealerSoldVehicle }, { "dealerAllSoldVehicles": soldVehicle }]
        res.status(200).json({
            status: true,
            message: "dealer sold vehicle details",
            dealerSoldVehicleInCars
        })

    } catch (err) {
        console.error('Error fetching  data:', err);
        res.status(500).json({ error: 'Internal server error' });

    }
})


// TO VIEW ALL VEHICLES DEALERSHIP HAS SOLD || GET

dealershipRouter.get("/dealer-sold-vehicles", dealerAuthMiddleware, async (req, res) => {
    const dealerId = req.dealer.dealershipId
    const objectIddealershipId = new ObjectId(dealerId)

    const content = await connectDB()
    try {
        const dealership = await content.collection('dealership').findOne({ _id: objectIddealershipId })
        if (!dealership) {
            return res.status(401).json({ message: "DealerShio not Found" });
        }
        const soldVehiclesIds = dealership.sold_vehicles

        const dealerSoldVehicle = await content.collection("sold_vehicles").find({ vehicle_id: { $in: soldVehiclesIds } }).toArray()
        res.status(200).json({
            status: true,
            message: "dealer sold vehicle details",
            dealerSoldVehicle
        })

    } catch (err) {
        console.error('Error fetching  data:', err);
        res.status(500).json({ error: 'Internal server error' });

    }
})

// TO ADD NEW CAR IN DEALERSHIP CARS || POST

dealershipRouter.post("/dealer-add-cars", dealerAuthMiddleware, async (req, res) => {
    const dealerId = req.dealer.dealershipId
    const objectIddealershipId = new ObjectId(dealerId)
    const newCarIds = generateRandomId()

    const content = await connectDB()
    try {
        const dealershipCollection = content.collection('dealership');
        const dealership = await dealershipCollection.findOne({ _id: objectIddealershipId })
        if (!dealership) {
            return res.status(401).json({ message: "DealerShio not Found" });
        }

        dealership.cars.push(newCarIds)
        const result = await dealershipCollection.updateOne({ _id: objectIddealershipId }, { $set: { cars: dealership.cars } })
        const modifiedCount = result.modifiedCount
        res.status(201).json({
            status: true,
            message: { message: 'new Car added to dealership successfully', newCarIds },
            modifiedCount,
            dealership: [{ "Dealer Name": dealership.dealership_name }, { "Dealer Car": dealership.cars }]
        })

    } catch (err) {
        console.error('Error fetching  data:', err);
        res.status(500).json({ error: 'Internal server error' });

    }
})


// TO VIEW DEALS PROVIDED BY DEALERSHIP || GET

dealershipRouter.get('/view-dealership-deals', dealerAuthMiddleware, async (req, res) => {
    const content = await connectDB()

    try {
        const projection = {
            "id": 1,
            "deal_id": 1,
            "deal_info": 1,
            "car_id": 1,

        }

        const pipline = dealerPipeline(projection)
        const deals = await content.collection('deal').aggregate(pipline).toArray();
        res.status(200).json({
            succes: true,
            message: "successfully fetch deals",
            deals
        })
    } catch (err) {
        console.error('Error fetching  data:', err);
        res.status(500).json({ error: 'Internal server error' });

    }

})


// To add deals to dealership

//WILL USE CREATE TO CREAT A NEW DEAL THROUGH AN DEALER 





export default dealershipRouter;

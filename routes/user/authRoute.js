import express from "express";
import connectDB from "../../config/db.js";
import JWT from "jsonwebtoken"
import { authMiddleware } from "../../middleware/authMiddleware.js"
import tokenBlacklist from "../../blackListToken/blackListToken.js";
import { ObjectId } from "mongodb";


const router = express.Router()

// USER LOGIN || POST

router.post('/auth/login', async (req, res) => {
    const { user_email, password } = req.body

    // user collecction connection
    const content = await connectDB()
    const data = content.collection('user')

    try {
        if (!user_email || !password) {
            res.status(401).json({ message: "please enter user email and password" })
        }
        // finding user with email
        let user = await data.findOne({ user_email })
        if (!user || user.password !== password) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        //hiding password in response
        const { password: userPassword, ...userWithoutPassword } = user;

        //creating JSONTOKEN
        const token = JWT.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        res.status(200).json({
            succes: true,
            message: "login successfully",
            user: userWithoutPassword,
            token
        })

    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'error while login',
            err
        });
    }
})


//======================== CREATING API ENDPOINTS FOR USER ==========================//

//USER-PIPLINE

const userPipeline = (projection, matching) => {
    const pipline = [
        {
            $lookup: {
                from: "sold_vehicles",
                localField: "vehicle_info",
                foreignField: "vehicle_id",
                as: "joined_sold_vehicles"
            }
        },
        {
            $lookup: {
                from: "dealership",
                localField: "joined_sold_vehicles.vehicle_id",
                foreignField: "sold_vehicles",
                as: "joined_dealership"
            }
        },
        {
            $lookup: {
                from: "deal",
                localField: "joined_dealership.deals",
                foreignField: "deal_id",
                as: "joined_deals"
            }
        },
        {
            $lookup: {
                from: "cars",
                localField: "joined_dealership.cars",
                foreignField: "car_id",
                as: "joined_cars_dealership"
            }
        },
        {
            $lookup: {
                from: "cars",
                localField: "joined_deals.car_id",
                foreignField: "car_id",
                as: "joined_cars_deal"
            }
        },
        {
            $lookup: {
                from: "cars",
                localField: "joined_sold_vehicles.car_id",
                foreignField: "car_id",
                as: "joined_cars_sold_vehicles"
            }
        },
    ]
    if (projection) {
        pipline.push({ $project: projection })
    }
    if (matching) {
        pipline.push({ $match: matching })
    }

    return pipline
}



//  TO VIEW ALL CARS || GET

router.get("/all-cars", authMiddleware, async (req, res) => {
    try {
        const projection = {
            "_id": 1,
            "type": 1,
            "name": 1,
            "model": 1,
            "car_info": 1,
            "car_id": 1
        }

        const pipline = userPipeline(projection)
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


// b. TO VIEW ALL CARS IN DEALERSHIP || GET

router.get("/dealer-all-cars", authMiddleware, async (req, res) => {
    try {
        const projection = {
            "dealership_email": 1,
            "dealership_id": 1,
            "dealership_name": 1,
            "cars": 1,
        }
        const pipline = userPipeline(projection)

        const content = await connectDB()
        const dealersCar = await content.collection('dealership').aggregate(pipline).toArray();

        //all cars in single list
        const allDealersCars = []
        dealersCar.forEach((obj) => {
            const itemValue = obj['cars'];
            allDealersCars.push(itemValue)
        });
        const showedALLDealersCars = allDealersCars.flat()

        res.status(200).json({
            status: true,
            message: "succesfully fetch dealers-cars",
            showedALLDealersCars
        });
    } catch (err) {
        console.error('Error fetching dealer-car-data:', err);
        res.status(500).json({ error: 'Internal server error' });

    }

})



// c. TO VIEW DEALERSHIPS WITH A CERTAIN CAR || GET

router.get('/dealer-certain-car/:id', authMiddleware, async (req, res) => {
    try {
        const carId = req.params.id
        const projection = {
            "dealership_email": 1,
            "dealership_id": 1,
            "dealership_name": 1,
            "cars": 1,
        }
        const pipline = userPipeline(projection)
        const content = await connectDB()
        const dealersCar = await content.collection('dealership').aggregate(pipline).toArray();

        const dealerCertianCar = []
        dealersCar.forEach((obj) => {
            const itemValue = obj['cars'];
            dealerCertianCar.push(itemValue)
        });
        const showedDealerCertianCar = dealerCertianCar.flat()

        //matching individual
        const matchedCars = showedDealerCertianCar.filter(item => item === carId)
        if (!matchedCars) {
            res.status(200).json({ message: `no cars fund with this ${carId}` })
        }
        res.status(200).json({
            status: true,
            message: "succesfully fetch dealership",
            matchedCars
        });
    }
    catch (err) {
        console.error('Error fetching dealer-certain-car -data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// TO VIEW ALL VEHICLES OWNED BY USER || GET

router.get("/user-all-vehicles", authMiddleware, async (req, res) => {
    const userId = req.user.userId
    const objectIdUserId = new ObjectId(userId)
    const content = await connectDB()

    try {
        // const userVehicles = await content.collection('user').distinct('vehicle_info')
        const user = await content.collection('user').findOne({ _id: objectIdUserId })
        res.status(200).json({
            status: true,
            message: "succesfully fetch cars",
            userAllVehicles: {
                userName: user.user_info.fullName,
                userVehicles: user.vehicle_info
            }
        });

    } catch (err) {
        console.error('Error fetching dealer-certain-car -data:', err);
        res.status(500).json({ error: 'Internal server error' });

    }

})

// USER LOGOUT || POST 

router.post("/logout", authMiddleware, (req, res) => {
    const token = req.authToken

    //add to blacklist
    tokenBlacklist.add(token)

    // clearing response
    res.clearCookie("jsonwebtoken")

    res.status(200).json({
        success: true,
        message: "Logged out successfully.",
    });
})
export default router;

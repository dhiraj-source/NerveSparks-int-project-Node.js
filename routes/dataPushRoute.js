import express from "express"
import connectDB from "../config/db.js"
import { operationValue } from "../faker/userFake.js"
import { dealerOperation } from "../faker/dealerFake.js"
import { carsOperation } from "../faker/carFake.js"
import { soldVehiclesOperation } from "../faker/soldVehicle.js"
// import { generateSoldVehicles } from "../faker/soldVehicle.js"
import { dealsOperation } from "../faker/dealFake.js"


let maindata = operationValue()
let dealerData = dealerOperation()
let carsData = carsOperation()
let soldData = soldVehiclesOperation()
let dealData = dealsOperation()
// let soldData = generateSoldVehicles()

const router = express.Router()


//USER DETAILS || GET

router.get('/user/:id', async (req, res) => {
    try {
        const data = await connectDB()


        const { id } = req.params;
        console.log(id)

        let result = await new data.findOne({ _id: ObjectId(id) })
        if (!result) {
            console.log("no such data with related id")
            return;
        }
        res.status(200).send(result)
        console.log(result)
    } catch (error) {
        console.log(error)
    }
})

//UPDATE USER || POST



//USER DATA INSERT FAKE.JS || POST


router.post('/user-post-data', async (req, res) => {
    const content = await connectDB()
    const data = content.collection('user')

    let result = await data.insertMany(maindata)
    res.status(200).send(result)
    console.log(result)

})


//DEALERSHIP_COLLECTION

router.post('/dealer/post-data', async (req, res) => {

    const content = await connectDB()
    const data = content.collection('dealership')

    let result = await data.insertMany(dealerData)
    res.status(200).send(result)
    console.log(result)

})


//CAR_COLLECTION
router.post('/cars/post-data', async (req, res) => {

    const content = await connectDB()
    const data = content.collection('cars')

    let result = await data.insertMany(carsData)
    res.status(200).send(result)
    console.log(result)

})


//SOLD_VEHICLE COLLECTION
router.post('/soldVehicles/post-data', async (req, res) => {

    const content = await connectDB()
    const data = content.collection('sold_vehicles')

    let result = await data.insertMany(soldData)
    res.status(200).send(result)
    console.log(result)

})



//DEAL DATA
router.post('/deals/post-data', async (req, res) => {

    const content = await connectDB()
    const data = content.collection('deal')

    let result = await data.insertMany(dealData)
    res.status(200).send(result)
    console.log(result)

})
export default router



//Deals



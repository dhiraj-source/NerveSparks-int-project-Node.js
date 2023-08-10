import express from "express"
import dotenv from "dotenv"
import "colors"
import morgan from "morgan"

//dotenv config
dotenv.config()

//IMPORT FILES
import connectDB from "./config/db.js"
import userRoute from "./routes/dataPushRoute.js"
import authRoute from "./routes/user/authRoute.js"
import dealershipRouter from "./routes/dealership/authDealerRoute.js"
import collectionRoute from "./routes/admin/admin.js"
import adminRouter from "./routes/admin/adminRoute.js"




const app = express()


//useful packages
connectDB()
app.use(express.json())
app.use(morgan('tiny'))

app.use("/api/admin", adminRouter)

app.use("/api/collection", collectionRoute)

app.use("/api/v1", userRoute)

app.use("/api/user", authRoute)

app.use("/api/dealer", dealershipRouter)




const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`.bgBlue.white)
})
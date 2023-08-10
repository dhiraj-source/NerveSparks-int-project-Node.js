import express from "express"
import connectDB from "../../config/db.js";
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import { adminMiddleware } from "../../middleware/adminMiddleware.js";
import { ObjectId } from "mongodb";
import tokenBlacklist from "../../blackListToken/blackListToken.js";
const adminRouter = express.Router()



//ADMIN CREATE

adminRouter.post("/create-admin", async (req, res) => {
    const content = await connectDB()
    const { name, password, email, role } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(401).json({
                succes: false,
                message: "please Provide all Fields"
            })
        }
        //exsisting admin
        const exsistingAdmin = await content.collection('admin').findOne({ email })
        if (exsistingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin with this email already exists",
            });
        }
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const adminDocuments = {
            name: name,
            password: hashedPassword,
            email: email,
            role: role
        }

        await content.collection('admin').insertOne(adminDocuments)
        // exclude password from response 
        // const { password: adminPassword, ...adminWithoutPassword } = adminDocuments;

        res.status(201).json({
            status: true,
            message: `documents inserted successfully`,
            adminDocuments,

        })
        content.close();

    } catch (error) {
        res.status(401).json({
            success: false,
            message: "error while insertingsdsda",
        });

    }
})



//ADMIN LOGIN  

adminRouter.post("/admin/login", async (req, res) => {

    const { email, password } = req.body


    const content = await connectDB()
    const data = content.collection('admin')

    try {
        if (!email || !password) {
            res.status(401).json({ message: "please enter email and password" })
        }

        // FINDING admin with EMAIL 
        let admin = await data.findOne({ email })
        if (!admin) {
            return res.status(400).json({
                succes: false,
                message: "Admin not found"
            })
        }

        //MATCH PASSWORD

        const isMatch = await bcrypt.compare(password, admin.password)
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password!!",
            });
        }


        //CRERATING JSONTOKEN
        const token = JWT.sign({ adminId: admin._id }, process.env.SECRET_KEY, { expiresIn: '1d' });


        res.status(200).json({
            success: true,
            message: "Admin login successful",
            admin,
            token
        });

    } catch (error) {
        res.status(401).json({
            status: false,
            message: "something went wrong ",
            error
        })
    }
})




// UPDATE NEW PASSWORD

adminRouter.post("/update-password", adminMiddleware, async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const content = await connectDB()
    const adminId = new ObjectId(req.admin.adminId)

    try {
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                status: false,
                message: "please enter all field"
            })
        }
        const admin = await content.collection('admin').findOne({ _id: adminId })
        if (!admin) {
            return res.status(400).json({
                status: false,
                message: "admin not found e"
            })
        }

        const isMatch = await bcrypt.compare(oldPassword, admin.password)
        if (!isMatch || isMatch == null) {
            return res.status(400).json({
                status: false,
                message: "Invalid Password"
            })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedNewPassword = await bcrypt.hash(newPassword, salt)
        await content.collection('admin').updateOne({ _id: adminId }, { $set: { password: hashedNewPassword } })

        res.status(201).json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        res.status(401).json({
            status: false,
            message: "something went wrong ",
            error
        })
    }
})


//ADMIN LOGOUT

adminRouter.post("/logout", adminMiddleware, (req, res) => {

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


export default adminRouter;






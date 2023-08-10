import JWT from "jsonwebtoken"
import tokenBlacklist from "../blackListToken/blackListToken.js";

//===================== ADMIN AUTHENTICATION  MIDDLEWARE ========================//

export const adminMiddleware = (req, res, next) => {
    const adminHeader = req.headers.authorization;

    if (!adminHeader || !adminHeader.startsWith('Bearer')) {
        return res.status(401).json({ error: "UnAuthorized" })
    }
    const token = adminHeader.split(' ')[1]

    //CONDITION CHECK FOR BLACKLIST TOKEN.
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ meassage: "you are Logout , please Login again", error: "session expired!!" });
    }
    try {
        const payload = JWT.verify(token, process.env.SECRET_KEY);

        req.admin = { adminId: payload.adminId, role: "admin" };
        req.authToken = token;
        next()

    } catch (error) {
        return res.status(401).json({ error: 'Authentication Failed' });
    }
}
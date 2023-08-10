import JWT from "jsonwebtoken"

//===================== DEALER AUTHENTICATION  MIDDLEWARE ========================//

export const dealerAuthMiddleware = (req, res, next) => {
    const dealerAuthHeader = req.headers.authorization;

    if (!dealerAuthHeader || !dealerAuthHeader.startsWith('Bearer')) {
        return res.status(401).json({ error: "UnAuthorized" })
    }
    const token = dealerAuthHeader.split(' ')[1]

    try {
        const payload = JWT.verify(token, process.env.SECRET_KEY);

        req.dealer = { dealershipId: payload.dealershipId, role: "user" };
        res.authToken = token

        next()

    } catch (error) {
        return res.status(401).json({ error: 'Authentication Failed' });
    }


}

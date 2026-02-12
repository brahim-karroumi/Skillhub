import jwt from "jsonwebtoken";
function verifyToken(req, res, next) {
    try {
        //need split
        const headerToken = req.headers.authorization.split(" ")[1]
        if (!headerToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = headerToken
        const JWT_SECRET = process.env.JWT_SECRET;

        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        //to be explained later
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export default verifyToken;
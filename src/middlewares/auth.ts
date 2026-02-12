import jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";
import { AuthRequest } from "@/src/types/index";
function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        //need split
        const headerToken = req.headers.authorization?.split(" ")[1] as string;
        if (!headerToken) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const token = headerToken
        const JWT_SECRET = process.env.JWT_SECRET as string;
        if (!JWT_SECRET) {
            return res.status(500).json({ message: "Internal server error" });
        }
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        //to be explained later
        req.user = decoded as any;
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export default verifyToken;
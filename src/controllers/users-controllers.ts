import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readData, writeData } from "@/src/utils/fileDB";
import { RegisterBody, LoginBody , User } from "@/src/types/index";
import { Response } from "express";
async function register(req: RegisterBody, res: Response) {
    try {
        const { name, email, role, password } = req.body;
        const users = readData("users.json");
        const existingUser = users.find((user: User) => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user : User = {
            id: users.length + 1,
            name,
            email,
            role: role || "USER",
            password: hashedPassword
        }
        writeData("users.json", [...users, user]);
        
        // Redirect to login page after successful registration
        return res.redirect('/login');

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function login(req: LoginBody, res: Response) {
    try {
        const { email, password } = req.body
        const users = readData("users.json");
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = users.find((user: User) => user.email === email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Your password is incorrect" });
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            return res.status(500).json({ message: "Internal server error" });
        }
        const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "2minutes" })
        
        // Store token in cookie and redirect to dashboard
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 2 * 60 * 1000 // 2 minutes
        });
        
        return res.redirect('/api/v1/skills');

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { register, login };
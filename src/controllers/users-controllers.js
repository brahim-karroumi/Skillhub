import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { readData, writeData } from "#src/utils/fileDB.js";
async function register(req, res) {
    try {
        const { name, email, role, password } = req.body;
        const users = readData("users.json");
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = {
            id: users.length + 1,
            name,
            email,
            role: role || "USER",
            password: hashedPassword
        }
        console.log("===============")
        writeData("users.json", [...users, user]);
        console.log("===============")
        return res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body
        const users = readData("users.json");
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = users.find(user => user.email === email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Your password is incorrect" });
        }
        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "2minutes" })
        return res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export { register, login };
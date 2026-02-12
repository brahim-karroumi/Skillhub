import express, { Application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "@/src/routes/user.routes";
import skillsRoutes from "@/src/routes/skills.routes";
import path from "path";
import { Request, Response } from "express";
const app: Application = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src", "views"));

app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/skills", skillsRoutes);

// Render pages
app.get("/register", (req: Request, res: Response) => {
    res.render("register");
});

app.get("/login", (req: Request, res: Response) => {
    res.render("login");
});

app.get("/dashboard", (req: Request, res: Response) => {
    res.render("dashboard" , { skills: [] });
});


const PORT = parseInt(process.env.PORT || "10000");
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
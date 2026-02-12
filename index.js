import express from "express";
import dotenv from "dotenv";
import userRoutes from "#src/routes/user.routes.js";
import skillsRoutes from "#src/routes/skills.routes.js";
const app = express();
dotenv.config();

app.use(express.json());

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/skills", skillsRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
import express from "express";
import dotenv from "dotenv";
const app = express();
dotenv.config();

app.use(express.json());


const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
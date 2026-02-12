import { Router } from "express"
import { register , login } from "@/src/controllers/users-controllers";


const router = Router();

router.post("/register" , register);
router.post("/login" , login);


export default router;
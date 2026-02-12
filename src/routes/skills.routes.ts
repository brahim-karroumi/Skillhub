import { Router } from "express"
import { getAllSkills , addSkill , updateSkill, deleteSkill} from "@/src/controllers/skills-controllers";
import  verifyToken  from "@/src/middlewares/auth";


const router = Router();

router.get("/" , getAllSkills);
router.post("/" ,verifyToken, addSkill);
router.put("/:id" ,verifyToken, updateSkill);
router.delete("/:id" ,verifyToken, deleteSkill);

export default router;
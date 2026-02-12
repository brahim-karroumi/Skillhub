import { readData, writeData } from "@/src/utils/fileDB";
import { AuthRequest, Skill } from "@/src/types/index";
import { Response } from "express";
function addSkill(req: AuthRequest, res: Response) {
    try {
        const user = req.user;
        const skills = readData("skills.json");
        const { title, description } = req.body;
        console.log(req.body);
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const skill : Skill = {
            id: skills.length + 1,
            userId: user?.id as number,
            title,
            description: description || "",
            createdAt: new Date(),
        }
        writeData("skills.json", [...skills, skill]);
        
        // Redirect back to dashboard after adding
        return res.redirect('/api/v1/skills');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

function getAllSkills(req: AuthRequest, res: Response) {
    try {
        const skills = readData("skills.json");

        console.log(skills);
        return res.status(200).render("dashboard" , { skills });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

function updateSkill(req: AuthRequest, res: Response) {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const skills = readData("skills.json");
        const skill = skills.find((skill: Skill) => skill.id === Number(id))
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }
        skill.title = title || skill.title;
        skill.description = description || skill.description;
        skill.updatedAt = new Date();
        writeData("skills.json", skills);
        return res.status(200).json({ message: "Skill updated successfully", skill });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

function deleteSkill(req: AuthRequest, res: Response) {
    try {
        const { id } = req.params;
        const skills = readData("skills.json");
        const skill = skills.find((skill: Skill) => skill.id === Number(id))
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }
        const filteredSkills = skills.filter((skill: Skill) => skill.id !== Number(id))
        writeData("skills.json", filteredSkills);
        
        // Redirect back to dashboard after deleting
        return res.redirect('/api/v1/skills');
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export { addSkill, getAllSkills, updateSkill, deleteSkill };
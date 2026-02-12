import { readData, writeData } from "#src/utils/fileDB.js";
function addSkill(req, res) {
    try {
        const user = req.user;
        const skills = readData("skills.json");
        const { title, description } = req.body;
        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }
        const skill = {
            id: skills.length + 1,
            userId: user.id,
            title,
            description: description || "",
            createdAt: new Date(),
        }
        writeData("skills.json", [...skills, skill]);
        return res.status(201).json({ message: "Skill created successfully", skill });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

function getAllSkills(req, res) {
    try {
        const skills = readData("skills.json");

        return res.status(200).json({ message: "Skills fetched successfully", skills });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

function updateSkill(req, res) {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const skills = readData("skills.json");
        const skill = skills.find(skill => skill.id === Number(id))
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

function deleteSkill(req, res) {
    try {
        const { id } = req.params;
        const skills = readData("skills.json");
        const skill = skills.find(skill => skill.id === Number(id))
        if (!skill) {
            return res.status(404).json({ message: "Skill not found" });
        }
        const filteredSkills = skills.filter(skill => skill.id !== Number(id))
        writeData("skills.json", filteredSkills);
        return res.status(200).json({ message: "Skill deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export { addSkill, getAllSkills, updateSkill, deleteSkill };
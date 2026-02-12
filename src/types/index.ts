import { Request } from "express";

export interface User {
    id: number;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    password: string;
}

export interface Skill {
    id: number;
    userId: number;
    title: string;
    description: string;
    createdAt: Date | string;
    updatedAt?: Date | string;
}

export interface JWTPayload {
    id: number;
    role: string;
    email: string;
}

export interface AuthRequest extends Request {
    user?: JWTPayload;
}

export interface RegisterBody {
    body: {

        name: string;
        email: string;
        role?: "USER" | "ADMIN";
        password: string;
    }
}

export interface LoginBody {
    body: {

        email: string;
        password: string;
    }
}

export interface SkillBody {
    title: string;
    description?: string;
}
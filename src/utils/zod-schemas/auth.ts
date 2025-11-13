import { z } from "zod";

export const signUpSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})

export const signInSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
}).refine((data) => data.email && data.password, {
    path: ["email", "password"],
    message: "Email and password are required",
});
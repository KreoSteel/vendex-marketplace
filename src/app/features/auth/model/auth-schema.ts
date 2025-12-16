import { z } from "zod";

export const registerSchema = z
   .object({
      name: z.string().min(1, { message: "Name is required" }),
      email: z.email({ message: "Invalid email address" }),
      password: z
         .string()
         .min(8, { message: "Password must be at least 8 characters long" }),
   })
   .refine((data) => data.name && data.email && data.password, {
      path: ["name", "email", "password"],
      message: "All fields are required to register",
   });

export const loginSchema = z
   .object({
      email: z.email({ message: "Invalid email address" }),
      password: z
         .string()
         .min(8, { message: "Password must be at least 8 characters long" }),
   })
   .refine((data) => data.email && data.password, {
      path: ["email", "password"],
      message: "Email and password are required",
   });

export type TRegisterData = z.infer<typeof registerSchema>;
export type TLoginData = z.infer<typeof loginSchema>;

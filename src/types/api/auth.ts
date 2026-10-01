import { z } from "zod";
import { idSchema } from "./common";

export const staffRoleSchema = z.enum(["owner", "cashier", "kitchen"]);
export type StaffRole = z.infer<typeof staffRoleSchema>;


export const authUserSchema = z.object({
  id: idSchema,
  name: z.string(),
  role: staffRoleSchema,
  restaurant_id: idSchema,
});
export type AuthUser = z.infer<typeof authUserSchema>;


export const loginRequestSchema = z.object({
  email: z.email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;


export const authSessionSchema = z.object({
  access_token: z.string().min(1),

  expires_in: z.number().int().positive(),
  user: authUserSchema,
});
export type AuthSession = z.infer<typeof authSessionSchema>;



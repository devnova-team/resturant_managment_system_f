import { z } from "zod";
import { idSchema, paginationQuerySchema } from "./common";
import { staffRoleSchema } from "./auth";


export const staffSchema = z.object({
  id: idSchema,
  restaurant_id: idSchema,
  name: z.string(),
  email: z.email(),
  phone: z.string(),
  role: staffRoleSchema,
  is_active: z.boolean(),
});
export type Staff = z.infer<typeof staffSchema>;

export const staffQuerySchema = paginationQuerySchema;
export type StaffQuery = z.infer<typeof staffQuerySchema>;

export const createStaffRequestSchema = z.object({
  name: z.string().trim().min(1, "الاسم مطلوب"),
  email: z.email("البريد الإلكتروني غير صحيح"),
  phone: z.string().trim().min(1, "رقم الموبايل مطلوب"),
  role: staffRoleSchema,
  password: z.string().min(8, "كلمة المرور 8 حروف على الأقل"),
});
export type CreateStaffRequest = z.infer<typeof createStaffRequestSchema>;


export const updateStaffRequestSchema = createStaffRequestSchema
  .omit({ password: true })
  .extend({ is_active: z.boolean() })
  .partial();
export type UpdateStaffRequest = z.infer<typeof updateStaffRequestSchema>;

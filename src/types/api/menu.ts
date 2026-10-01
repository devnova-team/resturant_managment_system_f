import { z } from "zod";
import { idSchema, moneySchema, paginationQuerySchema } from "./common";
import { ingredientUnitSchema } from "./ingredients";


// ---------- Menu item ----------

export const menuItemSchema = z.object({
  id: idSchema,
  name: z.string(),
  category: z.string(),
  price: moneySchema,
  is_available: z.boolean(),
  is_archived: z.boolean(),
});
export type MenuItem = z.infer<typeof menuItemSchema>;


export const menuItemsQuerySchema = paginationQuerySchema.extend({
  category: z.string().optional(),
  include_archived: z.boolean().optional(),
});
export type MenuItemsQuery = z.infer<typeof menuItemsQuerySchema>;

export const menuItemInputSchema = z.object({
  name: z.string().trim().min(1, "اسم الصنف مطلوب"),
  category: z.string().trim().min(1, "التصنيف مطلوب"),
  price: z.number().positive("السعر لازم يكون أكبر من صفر").multipleOf(0.01, "السعر برقمين عشريين بحد أقصى"),
});
export type MenuItemInput = z.infer<typeof menuItemInputSchema>;

// ---------- Recipe ----------

export const recipeInputSchema = z.object({
  ingredients: z.array(
    z.object({
      ingredient_id: idSchema,
      quantity_required: z.number().positive("الكمية لازم تكون أكبر من صفر").multipleOf(0.001),
    }),
  ),
});
export type RecipeInput = z.infer<typeof recipeInputSchema>;

export const recipeSchema = z.object({
  menu_item_id: idSchema,
  ingredients: z.array(
    z.object({
      ingredient_id: idSchema,
      name: z.string(),
      unit: ingredientUnitSchema,
      quantity_required: z.number().positive(),
    }),
  ),
});
export type Recipe = z.infer<typeof recipeSchema>;

// ---------- Public menu  ----------

export const publicMenuItemSchema = z.object({
  id: idSchema,
  name: z.string(),
  price: moneySchema,
});
export type PublicMenuItem = z.infer<typeof publicMenuItemSchema>;

export const publicMenuSchema = z.object({
  restaurant: z.object({ name: z.string() }),
  categories: z.array(
    z.object({
      name: z.string(),
      items: z.array(publicMenuItemSchema),
    }),
  ),
});
export type PublicMenu = z.infer<typeof publicMenuSchema>;

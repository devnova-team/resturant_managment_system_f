import { z } from "zod";
import { idSchema, moneySchema, paginationQuerySchema } from "./common";

export const ingredientUnitSchema = z.enum(["kg", "g", "l", "ml", "piece"]);
export type IngredientUnit = z.infer<typeof ingredientUnitSchema>;

export const ingredientSchema = z.object({
  id: idSchema,
  name: z.string(),
  quantity: z.number().nonnegative(),
  unit: ingredientUnitSchema,
  unit_price: moneySchema,
  low_stock_threshold: z.number().nonnegative(),
  is_low_stock: z.boolean(),
});
export type Ingredient = z.infer<typeof ingredientSchema>;


export const ingredientsQuerySchema = paginationQuerySchema.extend({
  low_stock: z.boolean().optional(),
});
export type IngredientsQuery = z.infer<typeof ingredientsQuerySchema>;

export const ingredientInputSchema = z.object({
  name: z.string().trim().min(1, "اسم المكوّن مطلوب"),
  quantity: z.number().nonnegative("الكمية لا يمكن أن تكون سالبة").multipleOf(0.001),
  unit: ingredientUnitSchema,
  unit_price: z.number().nonnegative("السعر لا يمكن أن يكون سالبًا").multipleOf(0.01),
  low_stock_threshold: z.number().nonnegative().multipleOf(0.001),
});
export type IngredientInput = z.infer<typeof ingredientInputSchema>;


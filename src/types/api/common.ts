import { z } from "zod";

export const idSchema = z.string().min(1);
export const moneySchema = z.number().nonnegative();
export const dateTimeSchema = z.iso.datetime();
export const dateOnlySchema = z.iso.date();

// ---------- Success envelope ----------

export const apiSuccessSchema = <T extends z.ZodType>(data: T) =>
  z.object({
    success: z.literal(true),
    message: z.string(),
    data,
  });

export const apiMessageSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

export type ApiSuccess<T> = { success: true; message: string; data: T };
export type ApiMessage = z.infer<typeof apiMessageSchema>;

// ---------- Error envelope ----------

export const apiErrorCodeSchema = z.enum([
  "UNAUTHENTICATED",
  "FORBIDDEN", 
  "NOT_FOUND", 
  "ORDER_LOCKED", 
  "INSUFFICIENT_STOCK", 
  "INGREDIENT_IN_USE", 
  "VALIDATION_ERROR", 
  "INVALID_STATUS_TRANSITION", 
  "SERVER_ERROR", 
]);
export type ApiErrorCode = z.infer<typeof apiErrorCodeSchema>;

export const apiErrorSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  code: apiErrorCodeSchema,
  errors: z.record(z.string(), z.string()).optional(),
  details: z.record(z.string(), z.unknown()).optional(),
});
export type ApiError = z.infer<typeof apiErrorSchema>;

export const insufficientStockDetailsSchema = z.object({
  ingredient_id: idSchema,
  ingredient_name: z.string(),
});
export type InsufficientStockDetails = z.infer<typeof insufficientStockDetailsSchema>;

export const ingredientInUseDetailsSchema = z.object({
  menu_items: z.array(z.unknown()),
});
export type IngredientInUseDetails = z.infer<typeof ingredientInUseDetailsSchema>;

// ---------- Pagination----------

export const PAGINATION_DEFAULT_LIMIT = 20;
export const PAGINATION_MAX_LIMIT = 100;

export const paginationQuerySchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(PAGINATION_MAX_LIMIT).optional(),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const paginationMetaSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1),
  total: z.number().int().nonnegative(),
});
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

export const paginatedSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    items: z.array(item),
    meta: paginationMetaSchema,
  });

export type Paginated<T> = { items: T[]; meta: PaginationMeta };

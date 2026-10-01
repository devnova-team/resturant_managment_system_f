import { z } from "zod";
import { dateOnlySchema, dateTimeSchema, idSchema, moneySchema, paginationQuerySchema } from "./common";

// ---------- Enums ----------

export const orderChannelSchema = z.enum(["dine_in", "delivery"]);
export type OrderChannel = z.infer<typeof orderChannelSchema>;

export const orderStatusSchema = z.enum([
  "received",
  "preparing",
  "ready",
  "served",
  "out_for_delivery",
  "delivered",
]);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const kitchenStatusSchema = orderStatusSchema.extract(["received", "preparing", "ready"]);
export type KitchenStatus = z.infer<typeof kitchenStatusSchema>;

export const finalStatusSchema = orderStatusSchema.extract(["served", "out_for_delivery", "delivered"]);
export type FinalStatus = z.infer<typeof finalStatusSchema>;

export const paymentStatusSchema = z.enum(["unpaid", "partial", "paid"]);
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

// ---------- Order ----------

export const orderItemSchema = z.object({
  id: idSchema,
  menu_item_id: idSchema,
  name: z.string(),
  quantity: z.number().int().positive(),
  unit_price: moneySchema,
  notes: z.string().nullable(),
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const orderInvoiceSummarySchema = z.object({
  id: idSchema,
  payment_status: paymentStatusSchema,
  paid_amount: moneySchema,
  is_locked: z.boolean(),
});
export type OrderInvoiceSummary = z.infer<typeof orderInvoiceSummarySchema>;

export const orderSchema = z.object({
  id: idSchema,
  order_number: z.number().int().positive(),
  channel: orderChannelSchema,
  status: orderStatusSchema,
  customer_name: z.string().nullable(),
  customer_phone: z.string().nullable(),
  delivery_address: z.string().nullable(),
  tracking_token: z.string().nullable(),
  created_by_staff_id: idSchema.nullable(),
  created_at: dateTimeSchema,
  items: z.array(orderItemSchema),
  total_amount: moneySchema,
  invoice: orderInvoiceSummarySchema.nullable(),
});
export type Order = z.infer<typeof orderSchema>;

// ---------- Cashier requests ----------

const orderItemInputSchema = z.object({
  menu_item_id: idSchema,
  quantity: z.number().int("الكمية لازم تكون رقم صحيح").positive("الكمية لازم تكون أكبر من صفر"),
  notes: z.string().trim().max(500).optional(),
});
export type OrderItemInput = z.infer<typeof orderItemInputSchema>;

const orderItemsInputSchema = z.array(orderItemInputSchema).min(1, "لازم تضيف صنف واحد على الأقل");


export const createOrderRequestSchema = z.object({
  channel: z.literal("dine_in"),
  items: orderItemsInputSchema,
});
export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;


export const updateOrderRequestSchema = z.object({
  items: orderItemsInputSchema,
});
export type UpdateOrderRequest = z.infer<typeof updateOrderRequestSchema>;

export const finalStatusRequestSchema = z.object({
  status: finalStatusSchema,
});
export type FinalStatusRequest = z.infer<typeof finalStatusRequestSchema>;

export const ordersQuerySchema = paginationQuerySchema.extend({
  status: orderStatusSchema.optional(),
  channel: orderChannelSchema.optional(),
  from: dateOnlySchema.optional(),
  to: dateOnlySchema.optional(),
});
export type OrdersQuery = z.infer<typeof ordersQuerySchema>;

// ---------- Public ordering ----------


export const publicOrderRequestSchema = z.object({
  customer_name: z.string().trim().min(1, "الاسم مطلوب"),
  customer_phone: z.string().trim().regex(/^01[0125]\d{8}$/, "رقم الموبايل غير صحيح"),
  delivery_address: z.string().trim().min(1, "العنوان مطلوب"),
  items: orderItemsInputSchema,
});
export type PublicOrderRequest = z.infer<typeof publicOrderRequestSchema>;

export const publicOrderCreatedSchema = z.object({
  tracking_token: z.string().min(1),
  order_number: z.number().int().positive(),
  total_amount: moneySchema,
});
export type PublicOrderCreated = z.infer<typeof publicOrderCreatedSchema>;

export const trackingStatusSchema = orderStatusSchema.exclude(["served"]);
export type TrackingStatus = z.infer<typeof trackingStatusSchema>;

export const orderTrackingSchema = z.object({
  order_number: z.number().int().positive(),
  status: trackingStatusSchema,
  updated_at: dateTimeSchema,
});
export type OrderTracking = z.infer<typeof orderTrackingSchema>;

// ---------- Kitchen ----------

export const kitchenOrderSchema = z.object({
  id: idSchema,
  order_number: z.number().int().positive(),
  channel: orderChannelSchema,
  status: orderStatusSchema,
  created_at: dateTimeSchema,
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.number().int().positive(),
      notes: z.string().nullable(),
    }),
  ),
});
export type KitchenOrder = z.infer<typeof kitchenOrderSchema>;


export const kitchenStatusRequestSchema = z.object({
  status: kitchenStatusSchema,
});
export type KitchenStatusRequest = z.infer<typeof kitchenStatusRequestSchema>;

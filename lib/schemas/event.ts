import { z } from "zod";
import { COUNTRIES } from "@/lib/domain/countries";
import { STATUS_OPTIONS } from "@/lib/domain/status";

const countryCodes = COUNTRIES.map((c) => c.code) as [string, ...string[]];

const time = z
  .string()
  .regex(/^\d{2}:\d{2}(:\d{2})?$/, "Hora inválida (HH:MM)")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const eventCreateSchema = z.object({
  artist_id: z.uuid(),
  event_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  show_time: time,
  soundcheck_time: time,
  timezone: z.string().min(1).default("UTC"),
  status: z.enum(STATUS_OPTIONS as unknown as [string, ...string[]]).default("possible"),
  country_code: z.enum(countryCodes),
  city: z.string().max(100).optional().or(z.literal("").transform(() => undefined)),
  venue_name: z.string().min(1, "Requerido").max(200),
  festival_name: z.string().max(200).optional().or(z.literal("").transform(() => undefined)),
  fee_amount: z
    .union([z.string().regex(/^\d+([.,]\d{1,4})?$/), z.number()])
    .transform((v) => (typeof v === "string" ? Number(v.replace(",", ".")) : v))
    .nullish(),
  fee_currency: z.string().length(3).optional().or(z.literal("").transform(() => undefined)),
  promoter_name: z.string().max(120).optional().or(z.literal("").transform(() => undefined)),
  promoter_email: z.string().email().optional().or(z.literal("").transform(() => undefined)),
  promoter_phone: z.string().max(40).optional().or(z.literal("").transform(() => undefined)),
  notes: z.string().max(4000).optional().or(z.literal("").transform(() => undefined)),
});

export const eventUpdateSchema = eventCreateSchema.partial().extend({ id: z.uuid() });

export const eventStatusSchema = z.object({
  id: z.uuid(),
  status: z.enum(STATUS_OPTIONS as unknown as [string, ...string[]]),
});

export type EventCreateInput = z.infer<typeof eventCreateSchema>;
export type EventUpdateInput = z.infer<typeof eventUpdateSchema>;

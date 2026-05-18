import { z } from "zod";

export const artistCreateSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres").max(80),
  slug: z
    .string()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  notes: z.string().max(2000).optional().or(z.literal("").transform(() => undefined)),
});

export const artistUpdateSchema = artistCreateSchema.partial();

export const artistInviteSchema = z.object({
  artist_id: z.uuid(),
  email: z.string().email(),
});

export type ArtistCreateInput = z.infer<typeof artistCreateSchema>;
export type ArtistInviteInput = z.infer<typeof artistInviteSchema>;

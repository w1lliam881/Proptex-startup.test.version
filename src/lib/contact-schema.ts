import { z } from "zod";
import { contact } from "@/content/sv";

const e = contact.form.errors;

export const contactSchema = z.object({
  name: z.string().trim().min(2, e.name).max(120, e.name),
  email: z.string().trim().email(e.email).max(200, e.email),
  company: z.string().trim().max(160).optional().default(""),
  role: z.enum(["fastighetsagare", "installator", "privatperson", "annat"], { message: e.role }),
  message: z.string().trim().min(5, e.message).max(3000, e.messageLong),
  consent: z.literal(true, { message: e.consent }),
  // Honeypot: ska vara tomt
  website: z.string().max(0).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;

import { z } from "zod";

const envSchema = z.object({
  MODE: z.enum(["development", "production", "test"]).default("development"),
  VITE_API_URL: z.string().default("http://localhost:4000"),
  VITE_DOC_CUSTOM_URL: z.string().default("http://localhost:4001"),
  VITE_API_INTEGRACAO_GPT_URL: z.string().default("http://localhost:3000"),
  VITE_SERVICE_VERSION: z.string().default("1.0.0"),
});

export const env = envSchema.parse(import.meta.env);

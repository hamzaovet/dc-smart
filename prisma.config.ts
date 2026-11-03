import "dotenv/config";
import { defineConfig } from "prisma/config";

const fallback = "postgresql://neondb_owner:npg_9rXC3GEyFUKx@ep-dry-recipe-baxh40lf.c-8.eu-central-1.aws.neon.tech/neondb?sslmode=require";
const rawUrl =
  (process.env.DIRECT_URL || process.env.DATABASE_URL || fallback)
    .replace("&channel_binding=require", "")
    .replace("-pooler.", ".");

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: rawUrl,
  },
});

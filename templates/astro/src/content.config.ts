// Content Collections — Astro auto-discovers every .md file inside
// src/content/reports/ and exposes them via getCollection("reports").
// Drop a new .md file into that directory and it appears in the sidebar
// navigation without any manual wiring.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const reports = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/reports" }),
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
  }),
});

export const collections = { reports };

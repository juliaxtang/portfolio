import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Case studies live in src/content/projects/*.mdx.
 *
 * The schema locks down METADATA only — the body of each .mdx is freeform
 * MDX that composes the shared component vocabulary in src/components/case-study/.
 * One case study can be 5 sections of prose; another can be a single video
 * with one paragraph. Layout consistency comes from the components, not from
 * a forced section template.
 */
const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      order: z.number().default(999),
      tags: z.array(z.string()).default([]),
      year: z.number().optional(),
      role: z.string().optional(),
      company: z.string().optional(),
      hero: z
        .object({
          src: z.string(),
          alt: z.string(),
          poster: z.string().optional(),
          isVideo: z.boolean().default(false),
        })
        .optional(),
      cover: z.string().optional(),
      coverAlt: z.string().optional(),
      accent: z.string().optional(),
      pubDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };

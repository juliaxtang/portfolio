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
      companyLogo: z.string().optional(),
      team: z.array(z.string()).optional(),
      hero: z
        .object({
          src: z.string(),
          alt: z.string(),
          poster: z.string().optional(),
          isVideo: z.boolean().default(false),
          /* Skip the soft fade overlay on the right edge of the hero image
             (used when the image already extends cleanly across the band
             and the fade would just dim a finished composition). */
          noFade: z.boolean().default(false),
        })
        .optional(),
      cover: z.string().optional(),
      coverAlt: z.string().optional(),
      accent: z.string().optional(),
      heroVisual: z.object({
        type: z.enum(["two-phones", "overlay", "columns"]),
        phone1: z.string().optional(),
        phone2: z.string().optional(),
        src: z.string().optional(),
        col1: z.string().optional(),
        col2: z.string().optional(),
        col3: z.string().optional(),
        flipped: z.boolean().default(false),
        lightText: z.boolean().default(false),
        bg: z.string().optional(),
      }).optional(),
      pubDate: z.coerce.date().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };

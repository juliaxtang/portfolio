import { config, collection, fields } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';

const widthOptions = [
  { label: 'Narrow', value: 'narrow' },
  { label: 'Wide', value: 'wide' },
  { label: 'Bleed', value: 'bleed' },
] as const;

export default config({
  storage: { kind: 'local' },

  collections: {
    projects: collection({
      label: 'Case Studies',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        // ── Core ──────────────────────────────────────────────────────────
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({
          label: 'Summary',
          description: 'One sentence — used as meta description and MoreWork tile copy.',
          multiline: true,
        }),
        order: fields.integer({
          label: 'Sort order',
          description: 'Lower numbers appear first in MoreWork.',
          defaultValue: 999,
        }),
        draft: fields.checkbox({ label: 'Draft (hide from site)', defaultValue: false }),

        // ── Taxonomy ──────────────────────────────────────────────────────
        tags: fields.array(
          fields.text({ label: 'Tag' }),
          { label: 'Tags', itemLabel: (props) => props.value }
        ),
        year: fields.integer({ label: 'Year', validation: { isRequired: false } }),

        // ── Credits ───────────────────────────────────────────────────────
        role: fields.text({ label: 'Role', validation: { isRequired: false } }),
        company: fields.text({ label: 'Company', validation: { isRequired: false } }),
        companyLogo: fields.text({
          label: 'Company logo path',
          description: 'e.g. /projects/tinder/logo.svg',
          validation: { isRequired: false },
        }),
        team: fields.array(
          fields.text({ label: 'Member' }),
          { label: 'Team', itemLabel: (props) => props.value }
        ),

        // ── Visuals ───────────────────────────────────────────────────────
        hero: fields.object(
          {
            src: fields.text({ label: 'Path (image or video)', validation: { isRequired: false } }),
            alt: fields.text({ label: 'Alt text', validation: { isRequired: false } }),
            poster: fields.text({ label: 'Poster frame (video only)', validation: { isRequired: false } }),
            isVideo: fields.checkbox({ label: 'Is video', defaultValue: false }),
          },
          { label: 'Hero' }
        ),
        cover: fields.text({ label: 'Cover image path (MoreWork tile)', validation: { isRequired: false } }),
        coverAlt: fields.text({ label: 'Cover alt text', validation: { isRequired: false } }),
        accent: fields.text({
          label: 'Accent color',
          description: 'CSS color, e.g. #FA7255. Falls back to brand primary.',
          validation: { isRequired: false },
        }),
        pubDate: fields.date({ label: 'Publish date' }),

        // ── Body ──────────────────────────────────────────────────────────
        content: fields.mdx({
          label: 'Content',
          components: {
            // ── Layout blocks ─────────────────────────────────────────
            Section: wrapper({
              label: 'Section',
              schema: {
                eyebrow: fields.text({ label: 'Eyebrow', validation: { isRequired: false } }),
                title: fields.text({ label: 'Title', validation: { isRequired: false } }),
                stage: fields.text({ label: 'Stage (nav label)', validation: { isRequired: false } }),
                wide: fields.checkbox({ label: 'Wide layout', defaultValue: false }),
                banner: fields.checkbox({ label: 'Banner style', defaultValue: false }),
                size: fields.select({
                  label: 'Size',
                  options: [{ label: 'Default', value: 'lg' }, { label: 'Sub-section', value: 'sub' }],
                  defaultValue: 'lg',
                }),
                hideFromNav: fields.checkbox({ label: 'Hide from section nav', defaultValue: false }),
              },
            }),

            TwoUp: wrapper({
              label: 'Two-up',
              schema: {
                ratio: fields.select({
                  label: 'Column ratio',
                  options: [
                    { label: '1:1', value: '1:1' },
                    { label: '1:2', value: '1:2' },
                    { label: '2:1', value: '2:1' },
                  ],
                  defaultValue: '1:1',
                }),
                gap: fields.select({
                  label: 'Gap',
                  options: [
                    { label: 'Small', value: 'sm' },
                    { label: 'Medium', value: 'md' },
                    { label: 'Large', value: 'lg' },
                  ],
                  defaultValue: 'md',
                }),
                wide: fields.checkbox({ label: 'Wide layout', defaultValue: false }),
              },
            }),

            Stats: wrapper({
              label: 'Stats grid',
              schema: {
                cols: fields.select({
                  label: 'Columns',
                  options: [
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                    { label: '4', value: '4' },
                  ],
                  defaultValue: '3',
                }),
                wide: fields.checkbox({ label: 'Wide layout', defaultValue: false }),
              },
            }),

            Callouts: wrapper({
              label: 'Callouts grid',
              schema: {
                cols: fields.select({
                  label: 'Columns',
                  options: [
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                    { label: '4', value: '4' },
                  ],
                  defaultValue: '3',
                }),
                wide: fields.checkbox({ label: 'Wide layout', defaultValue: false }),
              },
            }),

            Compare: wrapper({
              label: 'Compare (before/after)',
              schema: {
                leftLabel: fields.text({ label: 'Left label', validation: { isRequired: false } }),
                rightLabel: fields.text({ label: 'Right label', validation: { isRequired: false } }),
              },
            }),

            Persona: wrapper({
              label: 'Persona',
              schema: {
                name: fields.text({ label: 'Name' }),
                age: fields.integer({ label: 'Age', validation: { isRequired: false } }),
                status: fields.text({ label: 'Status', validation: { isRequired: false } }),
                role: fields.text({ label: 'Role', validation: { isRequired: false } }),
                education: fields.text({ label: 'Education', validation: { isRequired: false } }),
                location: fields.text({ label: 'Location', validation: { isRequired: false } }),
              },
            }),

            PersonaTrait: wrapper({
              label: 'Persona trait',
              schema: {
                label: fields.text({ label: 'Label' }),
              },
            }),

            Callout: wrapper({
              label: 'Callout',
              schema: {
                eyebrow: fields.text({ label: 'Eyebrow', validation: { isRequired: false } }),
                title: fields.text({ label: 'Title', validation: { isRequired: false } }),
                number: fields.text({ label: 'Number badge', validation: { isRequired: false } }),
                tone: fields.select({
                  label: 'Tone',
                  options: [
                    { label: 'Soft', value: 'soft' },
                    { label: 'Outline', value: 'outline' },
                    { label: 'Accent', value: 'accent' },
                  ],
                  defaultValue: 'soft',
                }),
              },
            }),

            Quote: wrapper({
              label: 'Quote',
              schema: {
                attribution: fields.text({ label: 'Attribution', validation: { isRequired: false } }),
              },
            }),

            SourceNote: wrapper({
              label: 'Source note',
              schema: {},
            }),

            // ── Media blocks ──────────────────────────────────────────
            Figure: block({
              label: 'Figure',
              schema: {
                src: fields.text({ label: 'Image path' }),
                alt: fields.text({ label: 'Alt text' }),
                caption: fields.text({ label: 'Caption', validation: { isRequired: false } }),
                width: fields.select({ label: 'Width', options: [...widthOptions], defaultValue: 'narrow' }),
                device: fields.select({
                  label: 'Device frame',
                  options: [
                    { label: 'None', value: 'auto' },
                    { label: 'Phone', value: 'phone' },
                    { label: 'Tablet', value: 'tablet' },
                  ],
                  defaultValue: 'auto',
                }),
                frame: fields.checkbox({ label: 'Add surface frame', defaultValue: false }),
                aspect: fields.text({ label: 'Aspect ratio (e.g. 4/3)', validation: { isRequired: false } }),
                background: fields.text({ label: 'Background override', validation: { isRequired: false } }),
              },
            }),

            Video: block({
              label: 'Video',
              schema: {
                src: fields.text({ label: 'Video path' }),
                poster: fields.text({ label: 'Poster image path', validation: { isRequired: false } }),
                caption: fields.text({ label: 'Caption', validation: { isRequired: false } }),
                width: fields.select({ label: 'Width', options: [...widthOptions], defaultValue: 'narrow' }),
                aspect: fields.text({ label: 'Aspect ratio', validation: { isRequired: false } }),
                loop: fields.checkbox({ label: 'Loop', defaultValue: true }),
                controls: fields.checkbox({ label: 'Show controls', defaultValue: false }),
              },
            }),

            Stat: block({
              label: 'Stat',
              schema: {
                value: fields.text({ label: 'Value (e.g. 2×, 64%, ↑)' }),
                label: fields.text({ label: 'Label' }),
                caption: fields.text({ label: 'Caption', validation: { isRequired: false } }),
              },
            }),
          },
        }),
      },
    }),
  },
});

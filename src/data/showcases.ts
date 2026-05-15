/**
 * Showcase text content for each case-study project.
 *
 * This is the single source of truth for the brand / title / tagline /
 * stats / accent used by:
 *   - the homepage <*Showcase> blocks (with their interactive heroes)
 *   - the "more work" footer on each case-study page (with the case
 *     study's own full-bleed hero image)
 *
 * Keep this in sync with the case-study frontmatter for `accent` and
 * `title`; the rest is homepage-specific copy that doesn't appear in
 * frontmatter (longer tagline, outcome stats).
 */

export interface ShowcaseStat {
  value: string;
  label: string;
}

export interface PressLogo {
  src: string;
  alt: string;
}

export interface ShowcaseContent {
  companyLogo: string;
  companyName: string;
  year: number;
  role: string;
  title: string;
  tagline: string;
  stats: ShowcaseStat[];
  accent: string;
  press?: PressLogo[];
}

export const showcaseContent: Record<string, ShowcaseContent> = {
  "tappy-cloud": {
    companyLogo: "/logos/tinder.png",
    companyName: "Tinder",
    year: 2023,
    role: "Product Design Lead",
    title: "Tappy Cloud",
    tagline:
      "Turned Tinder's static profile system into a backend-driven, dynamically configurable one. The centralized tool that came out of it, TaCo, has since powered 50+ profile experiments.",
    stats: [
      { value: "↑ 20%", label: "More likes sent across all experiments" },
      { value: "$50–110M", label: "In revenue lift, attributed" },
      { value: "50+", label: "Tappy experiments launched on TaCo" },
    ],
    accent: "#FD297C",
  },
  "festival-mode": {
    companyLogo: "/logos/tinder.png",
    companyName: "Tinder",
    year: 2022,
    role: "Product Design Lead",
    title: "Festival Mode",
    tagline:
      "Designed Festival Mode, a seasonal Tinder Explore experience for festivalgoers to meet others at the same festival. Two months to launch, driving 2× the likes and conversations of the main swipe stack.",
    stats: [
      { value: "2×", label: "More likes sent and convos started vs. main app" },
      { value: "↑ 10%", label: "Tile opens on Explore from the catch-all tile" },
      { value: "2 months", label: "From kickoff to launch" },
    ],
    accent: "#FA7255",
    press: [
      { src: "/projects/festival-mode/mashable-dark-logo.png", alt: "Mashable" },
      { src: "/projects/festival-mode/engadget-dark-logo.png", alt: "Engadget" },
      { src: "/projects/festival-mode/techcrunch-dark-logo.png", alt: "TechCrunch" },
      { src: "/projects/festival-mode/dailymail-dark-logo.png", alt: "Daily Mail" },
    ],
  },
  "custom-lists": {
    companyLogo: "/logos/tv time.png",
    companyName: "TV Time",
    year: 2020,
    role: "UX Designer",
    title: "Custom Lists",
    tagline:
      "Redesigned TV Time's Custom Lists feature to be more intuitive, more personal, and more shareable. Lifted list creation by double digits across new and existing users.",
    stats: [
      { value: "↑ 14%", label: "More new users created a list" },
      { value: "↑ 15%", label: "More lists created by new users" },
      { value: "↑ 10%", label: "More lists created by existing users" },
    ],
    accent: "#F4D9CC",
  },
  "tv-time-onboarding": {
    companyLogo: "/logos/tv time.png",
    companyName: "TV Time",
    year: 2020,
    role: "UX Designer",
    title: "Onboarding Redesign",
    tagline:
      "Led a week-long Design Sprint at TV Time to rethink onboarding around three user types, ending Friday with a tested prototype that taught key functions, key benefits, and the core habit loop.",
    stats: [
      { value: "100%", label: "test participants understood key functions of the app" },
      { value: "100%", label: "test participants understood how to perform core actions on the app" },
      { value: "5 days", label: "Sprint kickoff to tested prototype" },
    ],
    accent: "#DCD2E8",
  },
};

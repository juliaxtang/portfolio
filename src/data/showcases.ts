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
  height?: number;
  href?: string;
  nudgeY?: number;
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
  "snapchat-games": {
    companyLogo: "/logos/snapchat.png",
    companyName: "Snapchat",
    year: 2025,
    role: "Staff Product Designer",
    title: "Snapchat Games",
    tagline:
      "Defined and pitched Games strategy directly to Snap's CEO, securing a dedicated squad and scaling the product from an early-stage bet to a 30M+ DAU platform.",
    stats: [
      { value: "30M", label: "Games DAU" },
      { value: "↑ 2.9M", label: "Estimated Snap sends daily" },
      { value: "↑ 120%", label: "Game Video Posts on iOS" },
    ],
    accent: "#FFFC00",
  },
  "tappy-cloud": {
    companyLogo: "/logos/tinder.png",
    companyName: "Tinder",
    year: 2023,
    role: "Senior Product Designer",
    title: "Tappy Cloud",
    tagline:
      "Architected Tinder's transition from hardcoded profiles to dynamic profiles via a backend-driven experimentation platform. The design tool that came out of it, TaCo, has since powered 50+ experiments and an attributed $50-110M revenue lift.",
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
    role: "Senior Product Designer",
    title: "Festival Mode",
    tagline:
      "Turned live events into high-intent social discovery surfaces on Tinder, driving 2× the likes and conversations of the main swipe stack.",
    stats: [
      { value: "2×", label: "Likes sent and convos started vs. main stack" },
      { value: "↑ 10%", label: "Tile opens on Explore" },
      { value: "2 months", label: "From kickoff to launch" },
    ],
    accent: "#FA7255",
    press: [
      {
        src: "/projects/festival-mode/mashable-dark-logo.png",
        alt: "Mashable",
        height: 14,
        href: "https://mashable.com/article/tinder-festival-mode",
      },
      {
        src: "/projects/festival-mode/engadget-dark-logo.png",
        alt: "Engadget",
        height: 22.66,
        nudgeY: 3,
        href: "https://www.engadget.com/tinder-festival-mode-returns-163640137.html",
      },
      {
        src: "/projects/festival-mode/techcrunch-dark-logo.png",
        alt: "TechCrunch",
        height: 20.6,
        nudgeY: 4,
        href: "https://techcrunch.com/2022/04/14/tinder-adds-a-festival-mode-for-making-connections-ahead-of-concerts-and-events/",
      },
      {
        src: "/projects/festival-mode/dailymail-dark-logo.png",
        alt: "Daily Mail",
        height: 20,
        nudgeY: 5,
        href: "https://www.dailymail.com/sciencetech/article-10719027/Tinder-launches-FESTIVAL-MODE-lets-singletons-match-fellow-festivalgoers.html",
      },
    ],
  },
};

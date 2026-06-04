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
  /** Optional grid-track weight for this stat's column. Defaults to 1.
   *  Use to make one stat column narrower or wider than its siblings. */
  colFr?: number;
}

export interface PressLogo {
  src: string;
  alt: string;
  height?: number;
  href?: string;
  nudgeY?: number;
  suffix?: string;
  wrapNudgeY?: number;
}

export interface ShowcaseContent {
  companyLogo: string;
  companyName: string;
  year: number;
  role: string;
  title: string;
  tagline: string | string[];
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
    title: "Social Games",
    tagline: [
      "Games on Snapchat were camera filters with no product investment behind them.",
      "I saw the opportunity in the data, commissioned a research study, and shipped three bets tied to what we learned: a games drawer inside chat, fullscreen lens UX, and a turn-based flow that made playing with friends legible.",
      "All three landed. I got CEO buy-in to go big on Games and earned a dedicated squad.",
      "We scaled it into a proper product area with 30M daily users in less than a year.",
    ],
    stats: [
      { value: "30M", label: "Games DAU" },
      { value: "↑ 2.9M", label: "Snaps sent", colFr: 1.3 },
      { value: "↑ 120%", label: "Game Video Posts on iOS" },
    ],
    accent: "#FFFC00",
  },
  "topic-chats": {
    companyLogo: "/logos/snapchat.png",
    companyName: "Snapchat",
    year: 2025,
    role: "Staff Product Designer",
    title: "Topic Chats",
    tagline: [
      "Topic Chats was a half-finished public-chat MVP. The surface worked, the product didn't. Most chats opened with a wave of 'hi' posts and went quiet, because the topics were too broad and never enough people were in chat at once.",
      "I reshaped it into a live-events product anchored in sports and fandom. I designed the growth loops and high-leverage features (like the live scoreboard), and shaped the roadmap sequencing that got us to scale.",
    ],
    stats: [
      { value: "↑ 71K", label: "Incremental U.S. DAU" },
      { value: "40K", label: "Peak concurrent users in chat" },
      { value: "208K", label: "Messages sent per week" },
    ],
    accent: "#FFFC00",
    press: [
      {
        src: "/projects/festival-mode/techcrunch-dark-logo.png",
        alt: "TechCrunch",
        href: "https://techcrunch.com/2025/11/18/snapchat-rolls-out-topic-chats-for-public-conversations/",
      },
      {
        src: "/projects/topic-chats/Snap_Inc.-Logo-trim.png",
        alt: "Snap, Inc.",
        suffix: "Newsroom",
        href: "https://newsroom.snap.com/topic-chats-internets-most-active-group-chats",
      },
    ],
  },
  "tappy-cloud": {
    companyLogo: "/logos/tinder.png",
    companyName: "Tinder",
    year: 2023,
    role: "Senior Product Designer",
    title: "Dynamic Profiles",
    tagline: [
      "Tinder profiles were fixed: same content order for everyone, nothing personalized.",
      "Teams wanted to test layouts, but experiments collided and UI drifted without a shared system.",
      "I led a six-month, four-milestone build of Tappy Cloud and TaCo, turning the profile into a backend-driven surface where teams could quickly configure, test, and integrate with ML and AI models for more personalized profiles.",
    ],
    stats: [
      { value: "↑ 20%", label: "Likes sent across all experiments", colFr: 0.75 },
      { value: "$50–110M", label: "Attributed revenue lift" },
      { value: "100+", label: "Tappy experiments launched with TaCo", colFr: 0.85 },
    ],
    accent: "#FD297C",
  },
  "festival-mode": {
    companyLogo: "/logos/tinder.png",
    companyName: "Tinder",
    year: 2022,
    role: "Senior Product Designer",
    title: "Festival Mode",
    tagline: [
      "When IRL events came roaring back post-pandemic, Tinder had no real way for festivalgoers to find each other or plan their season together.",
      "I designed Festival Mode 0→1 on Tinder Explore: a season-long social discovery experience around live events and music, grounded in the festivalgoer persona. Shipped in time for the start of music festival season.",
    ],
    stats: [
      { value: "2×", label: "Likes sent and convos started vs. main stack" },
      { value: "↑ 10%", label: "Tile opens on Explore" },
      { value: "2 months", label: "From kickoff to launch" },
    ],
    accent: "#FA7255",
    press: [
      {
        src: "/projects/festival-mode/mashable-dark-logo.png",
        alt: "Mashable",
        href: "https://mashable.com/article/tinder-festival-mode",
        height: 12,
      },
      {
        src: "/projects/festival-mode/engadget-dark-logo.png",
        alt: "Engadget",
        href: "https://www.engadget.com/tinder-festival-mode-returns-163640137.html",
        height: 20,
      },
      {
        src: "/projects/festival-mode/techcrunch-dark-logo.png",
        alt: "TechCrunch",
        href: "https://techcrunch.com/2022/04/14/tinder-adds-a-festival-mode-for-making-connections-ahead-of-concerts-and-events/",
      },
      {
        src: "/projects/festival-mode/dailymail-dark-logo.png",
        alt: "Daily Mail",
        href: "https://www.dailymail.com/sciencetech/article-10719027/Tinder-launches-FESTIVAL-MODE-lets-singletons-match-fellow-festivalgoers.html",
        height: 14,
      },
    ],
  },
};

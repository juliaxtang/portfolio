/**
 * Snapchat Games VideoStack config — shared between the homepage Showcase
 * and the case-study Hero so the two surfaces stay in sync.
 */
export const snapchatGamesStackItems = [
  {
    src: "/projects/snapchat-games/storefront.mp4",
    alt: "Snapchat Games storefront",
    left: 0.02,
    top: 0.06,
    z: 1,
    rotation: -9,
    /* Storefront recording is 804x1622 — shorter than the 9:19.5 default;
       declare the true aspect so it fills its frame. */
    aspect: "804 / 1622",
    /* Override width so this video's rendered HEIGHT matches the other two
       (which use itemWidth 0.46 at 9:19.5). Width = target_height * aspect. */
    width: 0.494,
  },
  {
    src: "/projects/snapchat-games/live-multiplayer.mp4",
    alt: "Live multiplayer Snapchat game",
    left: 0.55,
    top: 0.02,
    z: 2,
    rotation: 9,
  },
  {
    src: "/projects/snapchat-games/turn-based.mp4",
    alt: "Turn-based game on Snapchat",
    left: 0.28,
    top: -0.08,
    z: 3,
    rotation: 0,
  },
] as const;

export const snapchatGamesStackProps = {
  maxWidth: "440px",
  aspect: "0.95 / 1",
  itemWidth: 0.46,
} as const;

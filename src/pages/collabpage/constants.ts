import type { CollabFormState, PlatformConfig } from "./types"

export const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxECGjy8_BiVLovO2cXHh7XZFnS6ogtqgiQiliQXVhlujdVoKHsnVFtVWZHqyZch1g/exec"

export const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    id: "instagram",
    label: "Instagram",
    tagline: "Reels, Stories & Feed",
    formats: [
      "Instagram Reel",
      "Instagram Story",
      "Static Feed Post",
      "Carousel Post",
      "Brand Collab Post",
    ],
  },
  {
    id: "facebook",
    label: "Facebook",
    tagline: "Reels, Posts & Live",
    formats: [
      "Facebook Reel",
      "Facebook Story",
      "Facebook Feed Post",
      "Facebook Live Session",
    ],
  },
  {
    id: "youtube",
    label: "YouTube",
    tagline: "Shorts & Integrations",
    formats: [
      "YouTube Short",
      "Dedicated Video",
      "Sponsored Integration (60s–90s)",
      "Community Post",
    ],
  },
]

export const SERVICE_OPTIONS = [
  {
    id: "promotional",
    label: "Promotional Content",
    subtitle: "Sponsored Reels, Stories & Posts on IG, FB & YT",
  },
  {
    id: "ugc",
    label: "UGC / Ad Creative",
    subtitle: "High-converting videos for your brand's paid ads",
  },
  {
    id: "ambassadorship",
    label: "Brand Ambassadorship",
    subtitle: "Long-term monthly or quarterly partnership",
  },
  {
    id: "event",
    label: "Event & Launch Appearance",
    subtitle: "In-person store launch, live coverage & hosting",
  },
] as const

export function createInitialCollabFormState(): CollabFormState {
  return {
    name: "",
    brand: "",
    email: "",
    service: "Promotional Content",
    platformDeliverables: {
      instagram: ["Instagram Reel"],
      facebook: [],
      youtube: [],
    },
    eventLocation: "",
    eventDate: "",
    eventTiming: "",
    description: "",
  }
}

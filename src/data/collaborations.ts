export type Collaboration = {
  id: string
  partner: string
  campaign: string
  category: string
  year: string
  image: string
}

// Replace these display details with each confirmed partner and campaign name.
// Keeping them here means new collaborations can be added without editing the page.
export const collaborations: Collaboration[] = [
  { id: "01", partner: "Creative Partner 01", campaign: "Fashion editorial", category: "Style", year: "2026", image: "/images/creator/2026-11-14%2023.53.08.jpg" },
  { id: "02", partner: "Creative Partner 02", campaign: "Beauty campaign", category: "Beauty", year: "2026", image: "/images/creator/2026-11-14%2023.54.12.jpg" },
  { id: "03", partner: "Creative Partner 03", campaign: "Everyday essentials", category: "Lifestyle", year: "2026", image: "/images/creator/2026-11-14%2023.54.17.jpg" },
  { id: "04", partner: "Creative Partner 04", campaign: "Summer story", category: "Fashion", year: "2025", image: "/images/creator/2026-11-14%2023.54.21.jpg" },
  { id: "05", partner: "Creative Partner 05", campaign: "Weekend edit", category: "Lifestyle", year: "2025", image: "/images/creator/2026-11-14%2023.54.40.jpg" },
  { id: "06", partner: "Creative Partner 06", campaign: "Personal style", category: "Style", year: "2025", image: "/images/creator/2026-11-14%2023.54.49.jpg" },
]

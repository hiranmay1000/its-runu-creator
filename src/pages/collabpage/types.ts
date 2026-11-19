export type PlatformId = "instagram" | "facebook" | "youtube"

export interface PlatformConfig {
  id: PlatformId
  label: string
  tagline: string
  formats: string[]
}

export interface CollabFormState {
  name: string
  brand: string
  email: string
  service: string
  platformDeliverables: Record<PlatformId, string[]>
  eventLocation: string
  eventDate: string
  eventTiming: string
  description: string
}

export interface InquiryEntry {
  name: string
  brand: string
  email: string
  date?: string
}

export interface InquiriesApiResponse {
  success: boolean
  total: number
  entries: InquiryEntry[]
  message?: string
}

export type SubmitStatus = "" | "sent" | "error"

declare global {
  interface Window {
    [key: string]: ((response: InquiriesApiResponse) => void) | undefined
  }
}

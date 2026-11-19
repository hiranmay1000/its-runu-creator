
import type { PlatformId } from "../types"

interface PlatformLogoProps {
  platform: PlatformId
  active: boolean
}

export function PlatformLogo({ platform }: PlatformLogoProps) {
  if (platform === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0"
        fill="none"
      >
        <defs>
          <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FEDA75" />
            <stop offset="30%" stopColor="#FA7E1E" />
            <stop offset="60%" stopColor="#D62976" />
            <stop offset="100%" stopColor="#4F5BD5" />
          </linearGradient>
        </defs>
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          stroke="url(#instagram-gradient)"
          strokeWidth="2"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="url(#instagram-gradient)"
          strokeWidth="2"
        />
        <circle cx="17.5" cy="6.5" r="1.2" fill="#D62976" />
      </svg>
    )
  }

  if (platform === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
        <path
          fill="#1877F2"
          d="M24 12a12 12 0 1 0-13.875 11.85V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.67 4.533-4.67 1.312 0 2.686.234 2.686.234v2.953h-1.512c-1.49 0-1.954.925-1.954 1.875V12h3.328l-.532 3.469h-2.796v8.38A12.002 12.002 0 0 0 24 12Z"
        />
        <path
          fill="#FFFFFF"
          d="M16.674 15.469 17.206 12h-3.328V9.748c0-.95.465-1.875 1.954-1.875h1.512V4.92s-1.374-.234-2.686-.234c-2.741 0-4.533 1.663-4.533 4.67V12H7.078v3.469h3.047v8.38a12.1 12.1 0 0 0 3.753 0v-8.38h2.796Z"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
      <rect x="2" y="4" width="20" height="16" rx="4" fill="#FF0000" />
      <polygon points="10 8.5 16 12 10 15.5" fill="#FFFFFF" />
    </svg>
  )
}

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type FormEvent,
  type TouchEvent,
} from "react"
import {
  ArrowUpRight,
  CheckCircle,
  Building2,
  Mail,
  Users,
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react"

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxECGjy8_BiVLovO2cXHh7XZFnS6ogtqgiQiliQXVhlujdVoKHsnVFtVWZHqyZch1g/exec"

type PlatformId = "instagram" | "facebook" | "youtube"

interface PlatformConfig {
  id: PlatformId
  label: string
  tagline: string
  formats: string[]
}

const PLATFORM_CONFIGS: PlatformConfig[] = [
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

const SERVICE_OPTIONS = [
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

interface CollabFormState {
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

interface InquiryEntry {
  name: string
  brand: string
  email: string
  date?: string
}

interface InquiriesApiResponse {
  success: boolean
  total: number
  entries: InquiryEntry[]
  message?: string
}

type SubmitStatus = "" | "sent" | "error"

declare global {
  interface Window {
    [key: string]: ((response: InquiriesApiResponse) => void) | undefined
  }
}

function PlatformLogo({
  platform,
  active,
}: {
  platform: PlatformId
  active: boolean
}) {
  if (platform === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    )
  }

  if (platform === "facebook") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    )
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="4" />
      <polygon
        points="10 9 15 12 10 15 10 9"
        fill={active ? "currentColor" : "none"}
      />
    </svg>
  )
}

export function CollabPage() {
  const [form, setForm] = useState<CollabFormState>({
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
  })

  const [activePlatform, setActivePlatform] = useState<PlatformId>("instagram")
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)
  const [formValidationError, setFormValidationError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<SubmitStatus>("")

  // Fetched brand inquiries state
  const [entries, setEntries] = useState<InquiryEntry[]>([])
  const [totalEntries, setTotalEntries] = useState<number>(0)
  const [fetchingEntries, setFetchingEntries] = useState<boolean>(true)
  const [entriesError, setEntriesError] = useState<string>("")

  // Carousel state + touch swipe support
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [visibleCards, setVisibleCards] = useState<number>(3)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const touchStartX = useRef<number | null>(null)

  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const isPromotional = form.service === "Promotional Content"
  const isEventAppearance = form.service === "Event & Launch Appearance"

  const currentPlatformConfig =
    PLATFORM_CONFIGS.find((p) => p.id === activePlatform) || PLATFORM_CONFIGS[0]
  const currentPlatformSelections = form.platformDeliverables[activePlatform]

  const totalSelectedFormats = Object.values(form.platformDeliverables).reduce(
    (sum, list) => sum + list.length,
    0
  )

  // Close multi-select dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Responsive visible cards count for carousel
  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1)
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2)
      } else {
        setVisibleCards(3)
      }
    }

    updateVisibleCards()
    window.addEventListener("resize", updateVisibleCards)
    return () => window.removeEventListener("resize", updateVisibleCards)
  }, [])

  // Fetch recent brand inquiries via JSONP
  const fetchEntries = useCallback(() => {
    setFetchingEntries(true)
    setEntriesError("")

    const callbackName = `jsonp_callback_${Date.now()}_${Math.floor(Math.random() * 10000)}`
    const script = document.createElement("script")
    let settled = false

    const cleanup = () => {
      delete window[callbackName]
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }

    const timeoutId = window.setTimeout(() => {
      if (settled) return
      settled = true
      setEntriesError("Request timed out while loading brand collaborations.")
      setFetchingEntries(false)
      cleanup()
    }, 10000)

    window[callbackName] = (response: InquiriesApiResponse) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)

      if (response && response.success) {
        setEntries(response.entries || [])
        setTotalEntries(response.total || 0)
        setCurrentIndex(0)
        setEntriesError("")
      } else {
        setEntriesError(response?.message || "Could not load brand inquiries.")
      }

      setFetchingEntries(false)
      cleanup()
    }

    script.src = `${SCRIPT_URL}?callback=${callbackName}`
    script.async = true
    script.onerror = () => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      setEntriesError(
        "Failed to reach Google Apps Script. Make sure you deployed a New Version set to Anyone."
      )
      setFetchingEntries(false)
      cleanup()
    }

    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const maxIndex = Math.max(0, entries.length - visibleCards)

  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex)
    }
  }, [currentIndex, maxIndex])

  useEffect(() => {
    if (isPaused || entries.length <= visibleCards) return

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 3500)

    return () => window.clearInterval(interval)
  }, [isPaused, entries.length, visibleCards, maxIndex])

  const handlePrevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }

  const handleNextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX
    setIsPaused(true)
  }

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        handleNextSlide()
      } else {
        handlePrevSlide()
      }
    }
    touchStartX.current = null
    setIsPaused(false)
  }

  const handleServiceChange = (serviceLabel: string) => {
    setFormValidationError("")
    setDropdownOpen(false)
    setForm((prev) => ({
      ...prev,
      service: serviceLabel,
    }))
  }

  const handlePlatformSelect = (platformId: PlatformId) => {
    setActivePlatform(platformId)
    setFormValidationError("")
  }

  const togglePlatformFormat = (platformId: PlatformId, format: string) => {
    setFormValidationError("")
    setForm((prev) => {
      const existing = prev.platformDeliverables[platformId]
      const updated = existing.includes(format)
        ? existing.filter((item) => item !== format)
        : [...existing, format]

      return {
        ...prev,
        platformDeliverables: {
          ...prev.platformDeliverables,
          [platformId]: updated,
        },
      }
    })
  }

  const formatDeliverablesSummary = (): string => {
    if (!isPromotional) {
      return isEventAppearance ? "Event Appearance" : "Custom Scope"
    }

    const parts: string[] = []
    PLATFORM_CONFIGS.forEach((platform) => {
      const selected = form.platformDeliverables[platform.id]
      if (selected.length > 0) {
        parts.push(`${platform.label}: ${selected.join(", ")}`)
      }
    })
    return parts.join(" | ")
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    if (isPromotional && totalSelectedFormats === 0) {
      setFormValidationError(
        "Please select at least one format under Instagram, Facebook, or YouTube."
      )
      return
    }

    if (
      isEventAppearance &&
      (!form.eventLocation.trim() ||
        !form.eventDate.trim() ||
        !form.eventTiming.trim())
    ) {
      setFormValidationError(
        "Please fill in the Event Location, Date, and Timing."
      )
      return
    }

    setLoading(true)
    setStatus("")
    setFormValidationError("")

    try {
      const payload = new URLSearchParams()
      payload.append("name", form.name.trim())
      payload.append("brand", form.brand.trim())
      payload.append("email", form.email.trim())
      payload.append("service", form.service)
      payload.append("deliverables", formatDeliverablesSummary())
      payload.append(
        "eventLocation",
        isEventAppearance ? form.eventLocation.trim() : "N/A"
      )
      payload.append(
        "eventDate",
        isEventAppearance ? form.eventDate.trim() : "N/A"
      )
      payload.append(
        "eventTiming",
        isEventAppearance ? form.eventTiming.trim() : "N/A"
      )
      payload.append("description", form.description.trim())

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: payload,
      })

      setStatus("sent")
      setForm({
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
      })
      setActivePlatform("instagram")
      setDropdownOpen(false)

      window.setTimeout(() => {
        fetchEntries()
      }, 1500)
    } catch (error) {
      console.error("Form submission error:", error)
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-[#f7f5f1] px-4 py-14 sm:px-6 sm:py-20 md:px-[8%] md:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-10 max-w-2xl sm:mb-14 md:mb-20">
          <p className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[2.5px] text-neutral-500 sm:mb-5 sm:text-[11px] sm:tracking-[3px]">
            <Sparkles size={13} className="shrink-0 text-neutral-600" />
            Brand Partnerships & Sponsored Campaigns
          </p>

          <h2 className="text-3xl font-normal leading-[1.12] tracking-tight text-[#222] sm:text-5xl md:text-6xl">
            Let's create content that{" "}
            <em className="font-serif">converts.</em>
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-7 text-neutral-500 sm:mt-6 md:text-base">
            Looking to collaborate on a campaign, product launch, or live event?
            Select your service below and share your brief.
          </p>
        </div>

        {/* Influencer Collaboration Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl">
          {/* Row 1: Your Name & Brand Name */}
          <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
            <div className="mb-8 sm:mb-10">
              <label
                htmlFor="name"
                className="mb-3 block text-[10px] uppercase tracking-[2px] text-neutral-600 sm:mb-4"
              >
                Your Name *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Riya Sharma"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full rounded-none border-0 border-b border-[#c9c5be] bg-transparent py-3.5 text-base text-[#222] outline-none transition-all duration-300 placeholder:text-neutral-400 focus:border-[#222] focus:ring-0 sm:py-4 sm:text-sm"
              />
            </div>

            <div className="mb-8 sm:mb-10">
              <label
                htmlFor="brand"
                className="mb-3 block text-[10px] uppercase tracking-[2px] text-neutral-600 sm:mb-4"
              >
                Brand / Agency Name *
              </label>

              <input
                id="brand"
                name="brand"
                type="text"
                placeholder="e.g. Nykaa, Boat, Mamaearth"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                required
                className="w-full rounded-none border-0 border-b border-[#c9c5be] bg-transparent py-3.5 text-base text-[#222] outline-none transition-all duration-300 placeholder:text-neutral-400 focus:border-[#222] focus:ring-0 sm:py-4 sm:text-sm"
              />
            </div>
          </div>

          {/* Row 2: Work Email */}
          <div className="mb-10 sm:mb-12">
            <label
              htmlFor="email"
              className="mb-3 block text-[10px] uppercase tracking-[2px] text-neutral-600 sm:mb-4"
            >
              Work Email Address *
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="partnerships@yourbrand.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full rounded-none border-0 border-b border-[#c9c5be] bg-transparent py-3.5 text-base text-[#222] outline-none transition-all duration-300 placeholder:text-neutral-400 focus:border-[#222] focus:ring-0 sm:py-4 sm:text-sm"
            />
          </div>

          {/* Row 3: Collaboration Services Selector */}
          <div className="mb-8 sm:mb-10">
            <label className="mb-3 block text-[10px] uppercase tracking-[2px] text-neutral-600 sm:mb-4">
              Collaboration Service *
            </label>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
              {SERVICE_OPTIONS.map((option) => {
                const selected = form.service === option.label
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleServiceChange(option.label)}
                    className={`flex flex-col items-start border p-4 text-left transition-all duration-200 sm:p-5 ${
                      selected
                        ? "border-[#222] bg-[#222] text-white"
                        : "border-[#d4d0c8] bg-[#fbfaf8] text-[#222] hover:border-[#222]"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="text-sm font-medium tracking-tight">
                        {option.label}
                      </span>
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? "border-white bg-white text-[#222]"
                            : "border-neutral-400"
                        }`}
                      >
                        {selected && <Check size={11} strokeWidth={3} />}
                      </span>
                    </div>
                    <span
                      className={`mt-1.5 text-xs leading-relaxed ${
                        selected ? "text-neutral-300" : "text-neutral-500"
                      }`}
                    >
                      {option.subtitle}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* CONDITIONAL SECTION 1: Promotional Content -> Platform Tab Cards + Dropdown */}
          {isPromotional && (
            <div
              className="mb-10 border border-[#dcd8d0] bg-[#f2efe9]/70 p-4 sm:mb-12 sm:p-6"
              ref={dropdownRef}
            >
              <div className="mb-4 flex flex-col justify-between gap-1 sm:flex-row sm:items-center">
                <label className="block text-[10px] uppercase tracking-[2px] text-neutral-600">
                  1. Choose Platform & Formats *
                </label>
                <span className="text-xs text-neutral-500">
                  {totalSelectedFormats}{" "}
                  {totalSelectedFormats === 1 ? "format" : "formats"} selected
                </span>
              </div>

              {/* Platform Tab Cards (Instagram, Facebook, YouTube) */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3">
                {PLATFORM_CONFIGS.map((platform) => {
                  const isActive = activePlatform === platform.id
                  const selectedCount =
                    form.platformDeliverables[platform.id].length

                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => handlePlatformSelect(platform.id)}
                      className={`flex items-center justify-between border p-3.5 text-left transition-all duration-200 sm:flex-col sm:items-start sm:p-4 ${
                        isActive
                          ? "border-[#222] bg-[#222] text-white shadow-sm"
                          : "border-[#d4d0c8] bg-[#fbfaf8] text-[#222] hover:border-[#222]"
                      }`}
                    >
                      <div className="flex items-center gap-3 sm:w-full sm:justify-between">
                        <div className="flex items-center gap-2.5">
                          <PlatformLogo
                            platform={platform.id}
                            active={isActive}
                          />
                          <span className="text-sm font-medium">
                            {platform.label}
                          </span>
                        </div>

                        {selectedCount > 0 && (
                          <span
                            className={`px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                              isActive
                                ? "bg-white text-[#222]"
                                : "bg-[#222] text-white"
                            }`}
                          >
                            {selectedCount}
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-[11px] sm:mt-2 ${
                          isActive ? "text-neutral-300" : "text-neutral-500"
                        }`}
                      >
                        {platform.tagline}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Active Platform Multi-Select Dropdown (Closed by default) */}
              <div className="mt-4">
                <label className="mb-2 block text-[10px] uppercase tracking-[2px] text-neutral-600">
                  2. Select {currentPlatformConfig.label} Deliverables
                </label>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex min-h-[52px] w-full items-center justify-between gap-3 border border-[#c9c5be] bg-[#fbfaf8] px-3.5 py-2.5 text-left text-sm text-[#222] transition-colors hover:border-[#222] focus:border-[#222] focus:outline-none sm:px-4 sm:py-3"
                  >
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {currentPlatformSelections.length === 0 ? (
                        <span className="text-neutral-400">
                          Click to select {currentPlatformConfig.label} formats
                          (Reel, Story, Post...)
                        </span>
                      ) : (
                        currentPlatformSelections.map((item) => (
                          <span
                            key={item}
                            onClick={(e) => {
                              e.stopPropagation()
                              togglePlatformFormat(activePlatform, item)
                            }}
                            className="inline-flex items-center gap-1.5 bg-[#222] px-2.5 py-1 text-xs text-white transition-colors hover:bg-neutral-700"
                          >
                            {item}
                            <X size={12} />
                          </span>
                        ))
                      )}
                    </div>

                    <ChevronDown
                      size={17}
                      className={`shrink-0 text-neutral-500 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="relative z-20 mt-1.5 border border-[#222] bg-[#fbfaf8] shadow-lg sm:absolute sm:left-0 sm:right-0">
                      {currentPlatformConfig.formats.map((format) => {
                        const isChecked =
                          currentPlatformSelections.includes(format)
                        return (
                          <button
                            key={format}
                            type="button"
                            onClick={() =>
                              togglePlatformFormat(activePlatform, format)
                            }
                            className="flex w-full items-center justify-between border-b border-[#ece8e0] px-4 py-3.5 text-left text-sm text-[#222] transition-colors last:border-b-0 hover:bg-[#f0ede6]"
                          >
                            <span>{format}</span>
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
                                isChecked
                                  ? "border-[#222] bg-[#222] text-white"
                                  : "border-neutral-400 bg-white"
                              }`}
                            >
                              {isChecked && <Check size={12} strokeWidth={3} />}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Cross-platform summary chips if user selected across multiple tabs */}
              {totalSelectedFormats > 0 && (
                <div className="mt-4 border-t border-[#e0dcd3] pt-3">
                  <p className="mb-2 text-[10px] uppercase tracking-[1.5px] text-neutral-500">
                    Selected Campaign Scope:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {PLATFORM_CONFIGS.map((platform) =>
                      form.platformDeliverables[platform.id].map((fmt) => (
                        <span
                          key={`${platform.id}-${fmt}`}
                          className="inline-flex items-center gap-1.5 border border-[#d4d0c8] bg-[#fbfaf8] px-2.5 py-1 text-[11px] text-[#222]"
                        >
                          <span className="font-medium">{platform.label}:</span>
                          <span>{fmt}</span>
                          <button
                            type="button"
                            aria-label={`Remove ${fmt}`}
                            onClick={() =>
                              togglePlatformFormat(platform.id, fmt)
                            }
                            className="ml-0.5 text-neutral-400 hover:text-[#222]"
                          >
                            <X size={11} />
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CONDITIONAL SECTION 2: Event & Launch Appearance -> Location, Date, Timing */}
          {isEventAppearance && (
            <div className="mb-10 border border-[#dcd8d0] bg-[#f2efe9]/70 p-4 sm:mb-12 sm:p-6">
              <p className="mb-5 text-[10px] uppercase tracking-[2px] text-neutral-600">
                Event & Appearance Schedule *
              </p>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {/* Location */}
                <div>
                  <label
                    htmlFor="eventLocation"
                    className="mb-2.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-neutral-600"
                  >
                    <MapPin size={13} className="text-neutral-500" />
                    Location / Venue *
                  </label>
                  <input
                    id="eventLocation"
                    name="eventLocation"
                    type="text"
                    placeholder="e.g. Quest Mall, Kolkata"
                    value={form.eventLocation}
                    onChange={(e) => {
                      setFormValidationError("")
                      setForm({ ...form, eventLocation: e.target.value })
                    }}
                    required={isEventAppearance}
                    className="w-full rounded-none border-0 border-b border-[#c9c5be] bg-transparent py-3 text-base text-[#222] outline-none transition-colors placeholder:text-neutral-400 focus:border-[#222] focus:ring-0 sm:text-sm"
                  />
                </div>

                {/* Date */}
                <div>
                  <label
                    htmlFor="eventDate"
                    className="mb-2.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-neutral-600"
                  >
                    <Calendar size={13} className="text-neutral-500" />
                    Event Date *
                  </label>
                  <input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => {
                      setFormValidationError("")
                      setForm({ ...form, eventDate: e.target.value })
                    }}
                    required={isEventAppearance}
                    className="w-full rounded-none border-0 border-b border-[#c9c5be] bg-transparent py-3 text-base text-[#222] outline-none transition-colors focus:border-[#222] focus:ring-0 sm:text-sm"
                  />
                </div>

                {/* Timing */}
                <div>
                  <label
                    htmlFor="eventTiming"
                    className="mb-2.5 flex items-center gap-1.5 text-[10px] uppercase tracking-[2px] text-neutral-600"
                  >
                    <Clock size={13} className="text-neutral-500" />
                    Event Timing *
                  </label>
                  <input
                    id="eventTiming"
                    name="eventTiming"
                    type="text"
                    placeholder="e.g. 5:00 PM – 8:00 PM IST"
                    value={form.eventTiming}
                    onChange={(e) => {
                      setFormValidationError("")
                      setForm({ ...form, eventTiming: e.target.value })
                    }}
                    required={isEventAppearance}
                    className="w-full rounded-none border-0 border-b border-[#c9c5be] bg-transparent py-3 text-base text-[#222] outline-none transition-colors placeholder:text-neutral-400 focus:border-[#222] focus:ring-0 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Description / Brief */}
          <div className="mb-10 sm:mb-12">
            <label
              htmlFor="description"
              className="mb-3 block text-[10px] uppercase tracking-[2px] text-neutral-600 sm:mb-4"
            >
              {isEventAppearance
                ? "Event Description, Dress Code & Appearance Role *"
                : "Campaign Brief, Timeline & Budget *"}
            </label>

            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder={
                isEventAppearance
                  ? "Describe the launch event, expected duration, media coverage, and what my role at the venue will involve..."
                  : "Tell me about your product, target launch date, usage rights, and estimated budget..."
              }
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
              className="w-full resize-y rounded-none border-0 border-b border-[#c9c5be] bg-transparent py-3.5 text-base leading-7 text-[#222] outline-none transition-all duration-300 placeholder:text-neutral-400 focus:border-[#222] focus:ring-0 sm:py-4 sm:text-sm"
            />
          </div>

          {formValidationError && (
            <p className="mb-6 flex items-center gap-2 text-xs text-red-600 sm:text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {formValidationError}
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group inline-flex w-full items-center justify-center gap-6 bg-[#222] px-8 py-4.5 text-[11px] uppercase tracking-[1.5px] text-white transition-all duration-300 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:justify-start sm:gap-8 sm:py-5"
          >
            {loading ? "Sending Proposal..." : "Request Collaboration"}

            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </button>

          {/* Success Message */}
          {status === "sent" && (
            <p className="mt-6 flex items-center gap-3 text-sm text-green-700 sm:mt-7">
              <CheckCircle size={18} className="shrink-0" />
              Campaign brief received! I'll review it and reply shortly.
            </p>
          )}

          {/* Error Message */}
          {status === "error" && (
            <p className="mt-6 text-sm text-red-600 sm:mt-7">
              Something went wrong. Please try again.
            </p>
          )}
        </form>

        {/* Sliding Brand Collaborations Carousel */}
        <div
          className="mt-20 border-t border-[#dcd8d0] pt-12 sm:mt-24 sm:pt-16 md:mt-32 md:pt-20"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="mb-8 flex flex-col justify-between gap-4 sm:mb-10 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2.5 text-[10px] uppercase tracking-[2.5px] text-neutral-500 sm:mb-3 sm:text-[11px] sm:tracking-[3px]">
                Brand Roster & Inquiries
              </p>
              <h3 className="text-2xl font-normal tracking-tight text-[#222] md:text-3xl">
                Brands that{" "}
                <em className="font-serif">connected recently.</em>
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start sm:gap-3 sm:self-auto">
              {totalEntries > 0 && (
                <div className="inline-flex items-center gap-2 border border-[#dcd8d0] bg-[#f0ede6] px-3.5 py-2 text-[10px] uppercase tracking-[1.5px] text-neutral-600 sm:px-4 sm:text-[11px]">
                  <Users size={14} className="text-neutral-500" />
                  <span>{totalEntries} Brands Reached Out</span>
                </div>
              )}

              {entries.length > visibleCards && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handlePrevSlide}
                    aria-label="Previous brand"
                    className="flex h-9 w-9 items-center justify-center border border-[#c9c5be] bg-[#fbfaf8] text-[#222] transition-colors hover:border-[#222] hover:bg-[#222] hover:text-white"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextSlide}
                    aria-label="Next brand"
                    className="flex h-9 w-9 items-center justify-center border border-[#c9c5be] bg-[#fbfaf8] text-[#222] transition-colors hover:border-[#222] hover:bg-[#222] hover:text-white"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {entriesError && (
            <div className="mb-8 flex items-start gap-3 border border-red-200 bg-red-50/80 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Unable to load brand list</p>
                <p className="mt-0.5 text-xs text-red-600">{entriesError}</p>
              </div>
            </div>
          )}

          {fetchingEntries ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-44 animate-pulse border border-[#e3dfd7] bg-[#f1eee8] p-6"
                />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="border border-[#dcd8d0] bg-[#f2efe9] p-6 text-sm text-neutral-500 sm:p-8">
              No brand inquiries yet. Be the first brand to collaborate!
            </div>
          ) : (
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Carousel Viewport */}
              <div className="overflow-hidden">
                <div
                  className="-mx-2.5 flex transition-transform duration-500 ease-out sm:-mx-3"
                  style={{
                    transform: `translateX(-${currentIndex * (100 / visibleCards)}%)`,
                  }}
                >
                  {entries.map((entry, idx) => (
                    <div
                      key={`${entry.name}-${entry.brand}-${idx}`}
                      style={{ flex: `0 0 ${100 / visibleCards}%` }}
                      className="px-2.5 sm:px-3"
                    >
                      <div className="flex h-full flex-col justify-between border border-[#dcd8d0] bg-[#fbfaf8] p-5 transition-all duration-300 hover:border-[#222] sm:p-6">
                        <div>
                          {/* Brand Name Header */}
                          <div className="mb-4 flex items-center justify-between gap-2">
                            <span className="inline-flex min-w-0 items-center gap-2 text-[11px] font-medium uppercase tracking-[2px] text-[#222]">
                              <Building2
                                size={14}
                                className="shrink-0 text-neutral-500"
                              />
                              <span className="truncate">{entry.brand}</span>
                            </span>
                            <span className="shrink-0 border border-[#e4e0d8] bg-[#f5f3ee] px-2 py-0.5 text-[9px] uppercase tracking-[1.5px] text-neutral-500">
                              Verified Inquiry
                            </span>
                          </div>

                          {/* Contact Person Name */}
                          <h4 className="text-lg font-normal tracking-tight text-[#222] sm:text-xl">
                            {entry.name}
                          </h4>
                        </div>

                        {/* Masked Email */}
                        <div className="mt-5 border-t border-[#ebe7df] pt-4 text-xs text-neutral-600 sm:mt-6">
                          <div className="flex items-center gap-2.5">
                            <Mail
                              size={14}
                              className="shrink-0 text-neutral-400"
                            />
                            <span className="truncate font-mono tracking-tight">
                              {entry.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination Dots */}
              {maxIndex > 0 && (
                <div className="mt-6 flex items-center justify-center gap-2 sm:mt-8">
                  {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => setCurrentIndex(dotIdx)}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                      className={`h-1.5 transition-all duration-300 ${
                        currentIndex === dotIdx
                          ? "w-7 bg-[#222]"
                          : "w-1.5 bg-[#c9c5be] hover:bg-neutral-500"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
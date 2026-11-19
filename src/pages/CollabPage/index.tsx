import {
  useState,
  useEffect,
  useCallback,
  type FormEvent,
} from "react"
import { Sparkles } from "lucide-react"
import {
  PLATFORM_CONFIGS,
  SCRIPT_URL,
  createInitialCollabFormState,
} from "./constants"
import type {
  CollabFormState,
  InquiriesApiResponse,
  InquiryEntry,
  PlatformId,
  SubmitStatus,
} from "./types"
import { BrandInquiries } from "./components/BrandInquiries"
import { CollaborationForm } from "./components/CollaborationForm"

export function CollabPage() {
  const [form, setForm] = useState<CollabFormState>(createInitialCollabFormState)

  const [formValidationError, setFormValidationError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<SubmitStatus>("")

  // Fetched brand inquiries state
  const [entries, setEntries] = useState<InquiryEntry[]>([])
  const [entriesRevision, setEntriesRevision] = useState(0)
  const [fetchingEntries, setFetchingEntries] = useState<boolean>(true)
  const [entriesError, setEntriesError] = useState<string>("")

  const isPromotional = form.service === "Promotional Content"
  const isEventAppearance = form.service === "Event & Launch Appearance"

  const totalSelectedFormats = Object.values(form.platformDeliverables).reduce(
    (sum, list) => sum + list.length,
    0
  )

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
        setEntriesRevision((revision) => revision + 1)
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
    const requestId = window.setTimeout(fetchEntries, 0)
    return () => window.clearTimeout(requestId)
  }, [fetchEntries])

  const handleServiceChange = (serviceLabel: string) => {
    setFormValidationError("")
    setForm((prev) => ({
      ...prev,
      service: serviceLabel,
    }))
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
      setForm(createInitialCollabFormState())

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

          {/* <p className="mt-4 max-w-lg text-sm leading-7 text-neutral-500 sm:mt-6 md:text-base">
            Planning a brand promo, launch, or event? Pick what fits below and share all the details with me!
          </p> */}
        </div>

        <CollaborationForm
          form={form}
          setForm={setForm}
          isPromotional={isPromotional}
          isEventAppearance={isEventAppearance}
          totalSelectedFormats={totalSelectedFormats}
          validationError={formValidationError}
          clearValidationError={() => setFormValidationError("")}
          loading={loading}
          status={status}
          onServiceChange={handleServiceChange}
          onTogglePlatformFormat={togglePlatformFormat}
          onSubmit={handleSubmit}
        />
        {/* LED-Style Scrolling Brand Message */}
        <div className="relative mt-16 overflow-hidden bg-[#222] py-4 sm:py-5">
          <style>
            {`
              @keyframes brand-marquee {
                from {
                  transform: translateX(-50%);
                }
                to {
                  transform: translateX(0%);
                }
              }

              .brand-marquee-track {
                animation: brand-marquee 25s linear infinite;
              }

              .brand-marquee-track:hover {
                animation-play-state: paused;
              }

              @media (prefers-reduced-motion: reduce) {
                .brand-marquee-track {
                  animation: none;
                }
              }
            `}
          </style>

          <div className="brand-marquee-track flex w-max items-center">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex shrink-0 items-center gap-6 px-6"
              >
                <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[2px] text-[#f7f5f1] sm:text-sm">
                  Planning a brand promo, launch, or event?
                </span>

                <span className="text-[#c9a96e]">✦</span>

                <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[2px] text-[#c9a96e] sm:text-sm">
                  Let's make something happen!
                </span>

                <span className="text-[#f7f5f1]">✦</span>
              </div>
            ))}
          </div>
        </div>

        <BrandInquiries
          key={entriesRevision}
          entries={entries}
          fetchingEntries={fetchingEntries}
          entriesError={entriesError}
        />
      </div>
    </section>
  )
}
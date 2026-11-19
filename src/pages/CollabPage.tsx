import { useState, useEffect, useCallback, type FormEvent } from "react"
import {
  ArrowUpRight,
  CheckCircle,
  Building2,
  Mail,
  Phone,
  Users,
  RefreshCw,
  AlertCircle,
} from "lucide-react"

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxECGjy8_BiVLovO2cXHh7XZFnS6ogtqgiQiliQXVhlujdVoKHsnVFtVWZHqyZch1g/exec"

interface CollabFormState {
  name: string
  email: string
  phone: string
  brand: string
  description: string
}

interface InquiryEntry {
  name: string
  brand: string
  email: string
  phone: string
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

export function CollabPage() {
  const [form, setForm] = useState<CollabFormState>({
    name: "",
    email: "",
    phone: "",
    brand: "",
    description: "",
  })

  const [loading, setLoading] = useState<boolean>(false)
  const [status, setStatus] = useState<SubmitStatus>("")

  // State for fetched inquiries
  const [entries, setEntries] = useState<InquiryEntry[]>([])
  const [totalEntries, setTotalEntries] = useState<number>(0)
  const [fetchingEntries, setFetchingEntries] = useState<boolean>(true)
  const [entriesError, setEntriesError] = useState<string>("")

  // Fetch recent inquiries via JSONP (matches Apps Script sendResponse)
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
      setEntriesError("Request timed out while loading inquiries.")
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
        setEntriesError("")
      } else {
        setEntriesError(response?.message || "Could not load inquiries.")
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
        "Failed to reach Google Apps Script. Check that the deployment is set to Anyone."
      )
      setFetchingEntries(false)
      cleanup()
    }

    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (loading) return

    setLoading(true)
    setStatus("")

    try {
      const payload = new URLSearchParams()

      Object.entries(form).forEach(([key, value]) => {
        payload.append(key, value.trim())
      })

      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: payload,
      })

      setStatus("sent")

      setForm({
        name: "",
        email: "",
        phone: "",
        brand: "",
        description: "",
      })

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
    <section className="bg-[#f7f5f1] px-6 py-20 md:px-[8%] md:py-28">
      <div className="mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mb-14 max-w-2xl md:mb-20">
          <p className="mb-5 text-[11px] uppercase tracking-[3px] text-neutral-500">
            Partnerships & campaigns
          </p>

          <h2 className="text-4xl font-normal leading-[1.1] tracking-tight text-[#222] md:text-6xl">
            Let's create something{" "}
            <em className="font-serif">memorable.</em>
          </h2>

          <p className="mt-6 max-w-lg text-sm leading-7 text-neutral-500 md:text-base">
            Have a campaign, partnership or creative idea?
            Tell us a little about it. We'd love to hear from you.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl">
          {/* Name & Email */}
          <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
            <div className="mb-10">
              <label
                htmlFor="name"
                className="mb-4 block text-[10px] uppercase tracking-[2px] text-neutral-600"
              >
                Your name *
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border-0 border-b border-[#c9c5be] bg-transparent py-4 text-sm text-[#222] outline-none transition-all duration-300 placeholder:text-neutral-400 focus:border-[#222] focus:ring-0"
              />
            </div>

            <div className="mb-10">
              <label
                htmlFor="email"
                className="mb-4 block text-[10px] uppercase tracking-[2px] text-neutral-600"
              >
                Email address *
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full border-0 border-b border-[#c9c5be] bg-transparent py-4 text-sm text-[#222] outline-none transition-all duration-300 placeholder:text-neutral-400 focus:border-[#222] focus:ring-0"
              />
            </div>
          </div>

          {/* Phone & Brand */}
          <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
            <div className="mb-10">
              <label
                htmlFor="phone"
                className="mb-4 block text-[10px] uppercase tracking-[2px] text-neutral-600"
              >
                Phone number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 00000 00000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border-0 border-b border-[#c9c5be] bg-transparent py-4 text-sm text-[#222] outline-none transition-all duration-300 placeholder:text-neutral-400 focus:border-[#222] focus:ring-0"
              />
            </div>

            <div className="mb-10">
              <label
                htmlFor="brand"
                className="mb-4 block text-[10px] uppercase tracking-[2px] text-neutral-600"
              >
                Brand / Company *
              </label>

              <input
                id="brand"
                name="brand"
                type="text"
                placeholder="Your brand name"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                required
                className="w-full border-0 border-b border-[#c9c5be] bg-transparent py-4 text-sm text-[#222] outline-none transition-all duration-300 placeholder:text-neutral-400 focus:border-[#222] focus:ring-0"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-12">
            <label
              htmlFor="description"
              className="mb-4 block text-[10px] uppercase tracking-[2px] text-neutral-600"
            >
              Tell us about your project *
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Share your campaign ideas, project details, requirements..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
              className="w-full resize-y border-0 border-b border-[#c9c5be] bg-transparent py-4 text-sm leading-7 text-[#222] outline-none transition-all duration-300 placeholder:text-neutral-400 focus:border-[#222] focus:ring-0"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group inline-flex items-center gap-8 bg-[#222] px-8 py-5 text-[11px] uppercase tracking-[1.5px] text-white transition-all duration-300 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send inquiry"}

            <ArrowUpRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </button>

          {/* Success Message */}
          {status === "sent" && (
            <p className="mt-7 flex items-center gap-3 text-sm text-green-700">
              <CheckCircle size={18} />
              Your request has been sent. Thank you!
            </p>
          )}

          {/* Error Message */}
          {status === "error" && (
            <p className="mt-7 text-sm text-red-600">
              Something went wrong. Please try again.
            </p>
          )}
        </form>

        {/* Recent Inquiries Section */}
        <div className="mt-24 border-t border-[#dcd8d0] pt-16 md:mt-32 md:pt-20">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[3px] text-neutral-500">
                Recent collaborations
              </p>
              <h3 className="text-2xl font-normal tracking-tight text-[#222] md:text-3xl">
                Brands & creators{" "}
                <em className="font-serif">who reached out.</em>
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
              {totalEntries > 0 && (
                <div className="inline-flex items-center gap-2 border border-[#dcd8d0] bg-[#f0ede6] px-4 py-2 text-[11px] uppercase tracking-[1.5px] text-neutral-600">
                  <Users size={14} className="text-neutral-500" />
                  <span>{totalEntries} Total Inquiries</span>
                </div>
              )}

              <button
                type="button"
                onClick={fetchEntries}
                disabled={fetchingEntries}
                className="inline-flex items-center gap-2 border border-[#c9c5be] bg-transparent px-4 py-2 text-[11px] uppercase tracking-[1.5px] text-[#222] transition-colors duration-200 hover:border-[#222] hover:bg-[#efece6] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  size={13}
                  className={fetchingEntries ? "animate-spin" : ""}
                />
                <span>{fetchingEntries ? "Refreshing" : "Refresh"}</span>
              </button>
            </div>
          </div>

          {entriesError && (
            <div className="mb-8 flex items-start gap-3 border border-red-200 bg-red-50/80 p-4 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Unable to load inquiries</p>
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
            <div className="border border-[#dcd8d0] bg-[#f2efe9] p-8 text-sm text-neutral-500">
              No inquiries logged yet. Be the first to start a conversation.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((entry, idx) => (
                <div
                  key={`${entry.name}-${entry.brand}-${idx}`}
                  className="flex flex-col justify-between border border-[#dcd8d0] bg-[#fbfaf8] p-6 transition-colors duration-300 hover:border-[#222]"
                >
                  <div>
                    {/* Brand Badge */}
                    <div className="mb-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[2px] text-neutral-500">
                      <Building2 size={13} className="text-neutral-400" />
                      <span className="truncate">{entry.brand}</span>
                    </div>

                    {/* Person Name */}
                    <h4 className="text-xl font-normal tracking-tight text-[#222]">
                      {entry.name}
                    </h4>
                  </div>

                  {/* Masked Contact Info */}
                  <div className="mt-6 space-y-2.5 border-t border-[#ebe7df] pt-4 text-xs text-neutral-600">
                    <div className="flex items-center gap-2.5">
                      <Mail size={14} className="shrink-0 text-neutral-400" />
                      <span className="truncate font-mono tracking-tight">
                        {entry.email}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Phone size={14} className="shrink-0 text-neutral-400" />
                      <span className="font-mono tracking-tight">
                        {entry.phone}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
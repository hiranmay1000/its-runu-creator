import type { FormEvent, Dispatch, SetStateAction } from "react"
import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle,
  ChevronDown,
} from "lucide-react"
import { PLATFORM_CONFIGS, SERVICE_OPTIONS } from "../constants"
import type { CollabFormState, PlatformId, SubmitStatus } from "../types"
import { PlatformLogo } from "./PlatformLogo"

interface CollaborationFormProps {
  form: CollabFormState
  setForm: Dispatch<SetStateAction<CollabFormState>>
  isPromotional: boolean
  isEventAppearance: boolean
  totalSelectedFormats: number
  validationError: string
  clearValidationError: () => void
  loading: boolean
  status: SubmitStatus
  onServiceChange: (serviceLabel: string) => void
  onTogglePlatformFormat: (platformId: PlatformId, format: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function CollaborationForm({
  form,
  setForm,
  isPromotional,
  isEventAppearance,
  totalSelectedFormats,
  validationError,
  clearValidationError,
  loading,
  status,
  onServiceChange,
  onTogglePlatformFormat,
  onSubmit,
}: CollaborationFormProps) {
  return (
    <form onSubmit={onSubmit} className="max-w-4xl">
      <div className="mb-12">
        <div className="mb-6 border-b border-[#dcd8d0] pb-3">
          <p className="text-[12px] font-bold uppercase tracking-[2.5px] text-neutral-500">
            01 — Contact Information
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
          <div>
            <label
              htmlFor="brand"
              className="mb-2 block text-[10px] uppercase tracking-[1.8px] text-neutral-600"
            >
              Brand / Agency Name *
            </label>
            <input
              id="brand"
              name="brand"
              type="text"
              placeholder="e.g. Nykaa, Boat, Mamaearth"
              value={form.brand}
              onChange={(event) =>
                setForm({ ...form, brand: event.target.value })
              }
              required
              className="w-full border border-[#d4d0c8] bg-[#fbfaf8] px-4 py-3.5 text-sm text-[#222] outline-none transition-all placeholder:text-neutral-400 focus:border-[#222] focus:shadow-[0_2px_10px_rgba(34,34,34,0.06)]"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-[10px] uppercase tracking-[1.8px] text-neutral-600"
            >
              Work Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="partnerships@yourbrand.com"
              value={form.email}
              onChange={(event) =>
                setForm({ ...form, email: event.target.value })
              }
              required
              className="w-full border border-[#d4d0c8] bg-[#fbfaf8] px-4 py-3.5 text-sm text-[#222] outline-none transition-all placeholder:text-neutral-400 focus:border-[#222] focus:shadow-[0_2px_10px_rgba(34,34,34,0.06)]"
            />
          </div>
        </div>
      </div>

      <div className="mb-12">
        <div className="mb-6 border-b border-[#dcd8d0] pb-3">
          <p className="text-[12px] font-bold uppercase tracking-[2.5px] text-neutral-500">
            02 — Collaboration Details
          </p>
          <p className="mt-2 text-sm text-[#222]">
            What kind of partnership are you looking for?
          </p>
        </div>

        <label
          htmlFor="collaborationService"
          className="mb-2 block text-[10px] uppercase tracking-[1.8px] text-neutral-600"
        >
          Collaboration Service *
        </label>

        <div className="relative">
          <select
            id="collaborationService"
            name="service"
            value={form.service}
            onChange={(event) => onServiceChange(event.target.value)}
            className="w-full cursor-pointer appearance-none border border-[#c9c5be] bg-[#fbfaf8] px-4 py-4 pr-12 text-sm font-medium text-[#222] outline-none transition-all hover:border-[#222] focus:border-[#222] focus:shadow-[0_3px_12px_rgba(34,34,34,0.08)]"
          >
            {SERVICE_OPTIONS.map((option) => (
              <option key={option.id} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-600">
            <ChevronDown size={18} strokeWidth={1.6} />
          </div>
        </div>

        <p className="mt-3 border-l-2 border-[#222] pl-3 text-xs leading-relaxed text-neutral-500">
          {SERVICE_OPTIONS.find((option) => option.label === form.service)
            ?.subtitle}
        </p>
      </div>

      {isPromotional && (
        <div className="mb-12">
          <div className="mb-6 flex items-end justify-between border-b border-[#dcd8d0] pb-3">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[2.5px] text-neutral-500">
                03 — Campaign Scope
              </p>
              <p className="mt-2 text-sm text-[#222]">
                Select your platforms and deliverables.
              </p>
            </div>

            <span className="text-xs tabular-nums text-neutral-500">
              {totalSelectedFormats} selected
            </span>
          </div>

          <div className="space-y-5">
            {PLATFORM_CONFIGS.map((platform) => {
              const selectedFormats = form.platformDeliverables[platform.id]

              return (
                <div
                  key={platform.id}
                  className="border border-[#dcd8d0] bg-[#fbfaf8] p-4 sm:p-5"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <PlatformLogo platform={platform.id} active={true} />

                    <div>
                      <p className="text-sm font-medium text-[#222]">
                        {platform.label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-neutral-500">
                        {platform.tagline}
                      </p>
                    </div>

                    <span className="ml-auto text-[10px] uppercase tracking-wider text-neutral-500">
                      {selectedFormats.length > 0
                        ? `${selectedFormats.length} selected`
                        : "Optional"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {platform.formats.map((format) => {
                      const selected = selectedFormats.includes(format)

                      return (
                        <button
                          key={format}
                          type="button"
                          onClick={() =>
                            onTogglePlatformFormat(platform.id, format)
                          }
                          aria-pressed={selected}
                          className={`flex min-h-11 items-center justify-between gap-3 border px-3 py-3 text-left text-xs transition-all duration-200 ${
                            selected
                              ? "border-[#222] bg-[#222] text-white"
                              : "border-[#e1ddd5] bg-transparent text-neutral-600 hover:border-[#222] hover:text-[#222]"
                          }`}
                        >
                          <span>{format}</span>

                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
                              selected
                                ? "border-white bg-white text-[#222]"
                                : "border-[#c9c5be]"
                            }`}
                          >
                            {selected && <Check size={11} strokeWidth={3} />}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {isEventAppearance && (
        <div className="mb-12">
          <div className="mb-6 border-b border-[#dcd8d0] pb-3">
            <p className="text-[10px] uppercase tracking-[2.5px] text-neutral-500">
              03 — Event Schedule
            </p>
            <p className="mt-2 text-sm text-[#222]">
              Share the details of your upcoming event.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label
                htmlFor="eventLocation"
                className="mb-2 block text-[10px] uppercase tracking-[1.8px] text-neutral-600"
              >
                Location / Venue *
              </label>
              <input
                id="eventLocation"
                name="eventLocation"
                type="text"
                placeholder="e.g. Quest Mall, Kolkata"
                value={form.eventLocation}
                onChange={(event) => {
                  clearValidationError()
                  setForm({ ...form, eventLocation: event.target.value })
                }}
                required={isEventAppearance}
                className="w-full border border-[#d4d0c8] bg-[#fbfaf8] px-3 py-3.5 text-sm text-[#222] outline-none placeholder:text-neutral-400 focus:border-[#222]"
              />
            </div>

            <div>
              <label
                htmlFor="eventDate"
                className="mb-2 block text-[10px] uppercase tracking-[1.8px] text-neutral-600"
              >
                Event Date *
              </label>
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                value={form.eventDate}
                onChange={(event) => {
                  clearValidationError()
                  setForm({ ...form, eventDate: event.target.value })
                }}
                required={isEventAppearance}
                className="w-full border border-[#d4d0c8] bg-[#fbfaf8] px-3 py-3.5 text-sm text-[#222] outline-none focus:border-[#222]"
              />
            </div>

            <div>
              <label
                htmlFor="eventTiming"
                className="mb-2 block text-[10px] uppercase tracking-[1.8px] text-neutral-600"
              >
                Event Timing *
              </label>
              <input
                id="eventTiming"
                name="eventTiming"
                type="text"
                placeholder="5 PM – 8 PM IST"
                value={form.eventTiming}
                onChange={(event) => {
                  clearValidationError()
                  setForm({ ...form, eventTiming: event.target.value })
                }}
                required={isEventAppearance}
                className="w-full border border-[#d4d0c8] bg-[#fbfaf8] px-3 py-3.5 text-sm text-[#222] outline-none placeholder:text-neutral-400 focus:border-[#222]"
              />
            </div>
          </div>
        </div>
      )}

      <div className="mb-10">
        <div className="mb-6 border-b border-[#dcd8d0] pb-3">
          <p className="text-[10px] uppercase tracking-[2.5px] text-neutral-500">
            {isEventAppearance ? "04 — Event Brief" : "04 — Your Campaign Brief"}
          </p>
          <p className="mt-2 text-sm text-[#222]">
            A few more details to help plan the collaboration.
          </p>
        </div>

        <label
          htmlFor="description"
          className="mb-2 block text-[10px] uppercase tracking-[1.8px] text-neutral-600"
        >
          {isEventAppearance
            ? "Event Description, Dress Code & Appearance Role *"
            : "Campaign Brief, Timeline & Budget *"}
        </label>

        <textarea
          id="description"
          name="description"
          rows={5}
          placeholder={
            isEventAppearance
              ? "Describe the event, expected duration, media coverage, dress code and your expectations..."
              : "Tell me about your product, campaign objectives, target launch date, usage rights and estimated budget..."
          }
          value={form.description}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
          required
          className="w-full resize-y border border-[#d4d0c8] bg-[#fbfaf8] px-4 py-4 text-sm leading-7 text-[#222] outline-none transition-all placeholder:text-neutral-400 focus:border-[#222] focus:shadow-[0_3px_12px_rgba(34,34,34,0.05)]"
        />

        <p className="mt-2 text-[11px] text-neutral-400">
          Please include any important requirements, timelines or budget details.
        </p>
      </div>

      {validationError && (
        <p className="mb-6 flex items-center gap-2 text-xs text-red-600 sm:text-sm">
          <AlertCircle size={16} className="shrink-0" />
          {validationError}
        </p>
      )}

      <div className="border-t border-[#dcd8d0] pt-7">
        <button
          type="submit"
          disabled={loading}
          className="group inline-flex w-full items-center justify-between gap-8 bg-[#222] px-6 py-5 text-[11px] font-medium uppercase tracking-[1.8px] text-white transition-all duration-300 hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[280px]"
        >
          <span>
            {loading ? "Sending Proposal..." : "Request Collaboration"}
          </span>

          <ArrowUpRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </button>

        <p className="mt-3 text-[11px] text-neutral-400">
          Your inquiry will be reviewed and we'll get back to you shortly.
        </p>

        {status === "sent" && (
          <p className="mt-5 flex items-center gap-3 text-sm text-green-700">
            <CheckCircle size={18} />
            Campaign brief received! I'll review it and reply shortly.
          </p>
        )}

        {status === "error" && (
          <p className="mt-5 text-sm text-red-600">
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </form>
  )
}

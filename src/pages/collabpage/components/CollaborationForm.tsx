
import type {
  FormEvent,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react"

import {
  AlertCircle,
  ArrowUpRight,
  Check,
  CheckCircle,
  ChevronDown,
} from "lucide-react"

import { PLATFORM_CONFIGS, SERVICE_OPTIONS } from "../constants"
import type {
  CollabFormState,
  PlatformId,
  SubmitStatus,
} from "../types"

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

// Consistent editorial-style inputs
const inputClass =
  "w-full rounded-none border border-[#dcd8d0] bg-[#fbfaf8] px-4 py-3.5 text-sm text-[#222] outline-none transition-colors duration-200 placeholder:text-neutral-400 hover:border-[#999] focus:border-[#18005b] focus:ring-1 focus:ring-[#18005b]/10"

const labelClass =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[1.2px] text-neutral-600"

//   const selectedService = SERVICE_OPTIONS.find(
//   (option) => option.label === form.service
// )

// const hasSelectedService = Boolean(
//   form.service?.trim() && selectedService
// )

// Reusable section
function Section({
  number,
  title,
  description,
  children,
}: {
  number: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="border border-[#dcd8d0] bg-[#fbfaf8] p-5 sm:p-7">
      <div className="mb-6 flex items-start gap-4 border-b border-[#e5e1da] pb-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-[#18005b] text-[10px] font-semibold tracking-wider text-white">
          {number}
        </span>

        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-[#222]">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-xs leading-relaxed text-neutral-500 sm:text-sm">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  )
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
  const selectedService = SERVICE_OPTIONS.find(
    (option) => option.label === form.service
  )

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-4xl space-y-6"
    >
      {/* 01 — Contact Information */}
      <Section
        number="01"
        title="Contact information"
        description="Let's start with a few details about your brand."
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="brand" className={labelClass}>
              Brand / Agency Name <span className="text-red-600">*</span>
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
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Work Email Address <span className="text-red-600">*</span>
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
              className={inputClass}
            />
          </div>
        </div>
      </Section>

      {/* 02 — Collaboration Details */}
      <Section
        number="02"
        title="Collaboration details"
        description="Choose the type of partnership you're interested in."
      >
        <label htmlFor="collaborationService" className={labelClass}>
          Collaboration Service <span className="text-red-600">*</span>
        </label>

        <div className="relative">
          <select
            id="collaborationService"
            name="service"
            value={form.service}
            onChange={(event) => onServiceChange(event.target.value)}
            required
            className={`${inputClass} cursor-pointer appearance-none pr-12`}
          >
            <option value="" disabled>
              Select a collaboration service
            </option>

            {SERVICE_OPTIONS.map((option) => (
              <option key={option.id} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={17}
            strokeWidth={1.6}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600"
          />
        </div>

        {selectedService?.subtitle && (
          <div className="mt-4 flex items-start gap-3 border-l-2 border-[#18005b] bg-[#f1eee8] px-4 py-3">
            <CheckCircle
              size={15}
              className="mt-0.5 shrink-0 text-[#18005b]"
            />

            <p className="text-xs leading-relaxed text-neutral-600">
              {selectedService.subtitle}
            </p>
          </div>
        )}
      </Section>

      {/* 03 — Campaign Scope */}
      {isPromotional && (
        <Section
          number="03"
          title="Campaign scope"
          description="Choose the social platforms and content deliverables."
        >
          <div className="mb-5 flex items-center justify-between border border-[#e5e1da] bg-white px-4 py-3">
            <span className="text-xs text-neutral-600">
              Selected deliverables
            </span>

            <span className="bg-[#18005b] px-3 py-1 text-xs font-semibold tabular-nums text-white">
              {totalSelectedFormats}
            </span>
          </div>

          <div className="space-y-4">
            {PLATFORM_CONFIGS.map((platform) => {
              const selectedFormats =
                form.platformDeliverables[platform.id]

              return (
                <div
                  key={platform.id}
                  className="border border-[#e5e1da] bg-white p-4 sm:p-5"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#eeeae3] bg-[#fbfaf8]">
                      <PlatformLogo
                        platform={platform.id}
                        active={selectedFormats.length > 0}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-[#222]">
                        {platform.label}
                      </h4>

                      <p className="mt-0.5 text-xs text-neutral-500">
                        {platform.tagline}
                      </p>
                    </div>

                    <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">
                      {selectedFormats.length > 0
                        ? `${selectedFormats.length} selected`
                        : "Optional"}
                    </span>
                  </div>

                  
                  <div className="flex flex-wrap gap-2">
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
                          className={`inline-flex min-h-10 items-center gap-2.5 border px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                            selected
                              ? "border-[#18005b] bg-[#18005b] text-white"
                              : "border-[#dcd8d0] bg-[#fbfaf8] text-neutral-600 hover:border-[#18005b] hover:text-[#18005b]"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-all duration-200 ${
                              selected
                                ? "border-white bg-white"
                                : "border-[#aaa49a] bg-transparent"
                            }`}
                          >
                            {selected && (
                              <Check
                                size={12}
                                strokeWidth={3}
                                className="text-[#18005b]"
                              />
                            )}
                          </span>

                          {format}
                        </button>
                      )
                    })}
                  </div>

                </div>
              )
            })}
          </div>
        </Section>
      )}

      {/* service: "", */}

      {/* <fieldset
  disabled={!hasSelectedService}
  aria-disabled={!hasSelectedService}
  className={`min-w-0 space-y-6 border-0 p-0 m-0 transition-opacity duration-300 ${
    !hasSelectedService
      ? "pointer-events-none opacity-40"
      : "opacity-100"
  }`}
></fieldset> */}

      {/* 03 — Event Schedule */}
      {isEventAppearance && (
        <Section
          number="03"
          title="Event schedule"
          description="Tell me where and when the event will take place."
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="eventLocation" className={labelClass}>
                Location / Venue <span className="text-red-600">*</span>
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
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="eventDate" className={labelClass}>
                Event Date <span className="text-red-600">*</span>
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
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="eventTiming" className={labelClass}>
                Event Timing <span className="text-red-600">*</span>
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
                className={inputClass}
              />
            </div>
          </div>
        </Section>
      )}

      {/* 04 — Campaign / Event Brief */}
      <Section
        number="04"
        title={
          isEventAppearance
            ? "Event brief"
            : "Your campaign brief"
        }
        description="Share your expectations so we can plan the collaboration."
      >
        <label htmlFor="description" className={labelClass}>
          {isEventAppearance
            ? "Event Description, Dress Code & Appearance Role"
            : "Campaign Brief, Timeline & Budget"}
          {" "}
          <span className="text-red-600">*</span>
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
          className={`${inputClass} min-h-36 resize-y leading-7`}
        />

        <p className="mt-3 text-[11px] leading-relaxed text-neutral-400">
          Include any important requirements, timelines or budget details.
        </p>
      </Section>

      {/* Validation */}
      {validationError && (
        <div
          role="alert"
          className="flex items-start gap-3 border border-red-200 bg-red-50 p-4"
        >
          <AlertCircle
            size={17}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <p className="text-sm text-red-700">
            {validationError}
          </p>
        </div>
      )}

      {/* Submit */}
      <div className="border-t border-[#dcd8d0] pt-7">
        <button
          type="submit"
          disabled={loading}
          className="group inline-flex w-full items-center justify-between gap-8 bg-[#222] px-6 py-5 text-[11px] font-semibold uppercase tracking-[1.8px] text-white transition-colors duration-300 hover:bg-[#18005b] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[280px]"
        >
          <span>
            {loading
              ? "Sending Proposal..."
              : "Request Collaboration"}
          </span>

          <ArrowUpRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </button>

        <p className="mt-3 text-[11px] leading-relaxed text-neutral-400">
          Your inquiry will be reviewed and we'll get back to you shortly.
        </p>

        {status === "sent" && (
          <div
            role="status"
            className="mt-5 flex items-center gap-3 border border-green-200 bg-green-50 p-4 text-sm text-green-800"
          >
            <CheckCircle size={18} className="shrink-0" />
            Campaign brief received! I'll review it and reply shortly.
          </div>
        )}

        {status === "error" && (
          <div
            role="alert"
            className="mt-5 border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            Something went wrong. Please try again.
          </div>
        )}
      </div>
    </form>
  )
}
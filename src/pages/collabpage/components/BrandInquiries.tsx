import { useEffect, useRef, useState, type TouchEvent } from "react"
import { AlertCircle, Building2, Mail } from "lucide-react"
import type { InquiryEntry } from "../types"

interface BrandInquiriesProps {
  entries: InquiryEntry[]
  fetchingEntries: boolean
  entriesError: string
}

export function BrandInquiries({
  entries,
  fetchingEntries,
  entriesError,
}: BrandInquiriesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCards, setVisibleCards] = useState(3)
  const [isPaused, setIsPaused] = useState(false)
  const touchStartX = useRef<number | null>(null)

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

  const maxIndex = Math.max(0, entries.length - visibleCards)
  const currentSlideIndex = Math.min(currentIndex, maxIndex)

  useEffect(() => {
    if (isPaused || entries.length <= visibleCards) return

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }, 3500)

    return () => window.clearInterval(interval)
  }, [isPaused, entries.length, visibleCards, maxIndex])

  const handlePrevSlide = () => {
    setCurrentIndex(currentSlideIndex <= 0 ? maxIndex : currentSlideIndex - 1)
  }

  const handleNextSlide = () => {
    setCurrentIndex(currentSlideIndex >= maxIndex ? 0 : currentSlideIndex + 1)
  }

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.touches[0].clientX
    setIsPaused(true)
  }

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return
    const deltaX = event.changedTouches[0].clientX - touchStartX.current
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

  return (
    <div
      className="mt-20 border-t border-[#dcd8d0] pt-12 sm:mt-24 sm:pt-16 md:mt-32 md:pt-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
        <div>
          <span className="mb-3 block text-xs font-medium text-neutral-500">
            The brand network
          </span>

          <h3 className="text-3xl font-normal tracking-tight text-[#222] sm:text-4xl">
            Recent <em className="font-serif text-neutral-500">connections.</em>
          </h3>

          <p className="mt-3 text-sm text-neutral-500">
            A growing community of brands reaching out to collaborate.
          </p>
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
        <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="overflow-hidden">
            <div
              className="-mx-2.5 flex transition-transform duration-500 ease-out sm:-mx-3"
              style={{
                transform: `translateX(-${currentSlideIndex * (100 / visibleCards)}%)`,
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

                      <h4 className="text-lg font-normal tracking-tight text-[#222] sm:text-xl">
                        {entry.name}
                      </h4>
                    </div>

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

          {maxIndex > 0 && (
            <div className="mt-6 flex items-center justify-center gap-2 sm:mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentIndex(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`h-1.5 transition-all duration-300 ${
                    currentSlideIndex === dotIdx
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
  )
}

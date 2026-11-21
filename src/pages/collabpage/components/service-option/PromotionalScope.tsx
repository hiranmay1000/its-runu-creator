import { useState } from "react";
import { Check } from "lucide-react";

import { PLATFORM_CONFIGS } from "../../constants";
import type { CollabFormState, PlatformId } from "../../types";
import { PlatformLogo } from "../PlatformLogo";

interface PromotionalScopeProps {
  form: CollabFormState;
  totalSelectedFormats: number;
  onTogglePlatformFormat: (platformId: PlatformId, format: string) => void;
}

export function PromotionalScope({
  form,
  totalSelectedFormats,
  onTogglePlatformFormat,
}: PromotionalScopeProps) {
  const [activePlatform, setActivePlatform] = useState<PlatformId>(
    PLATFORM_CONFIGS[0].id,
  );

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-[#222]">Campaign scope</h4>
          <p className="mt-1 text-xs text-neutral-500">
            Choose your social platforms and content deliverables.
          </p>
        </div>

        <span className="shrink-0 bg-[#18005b] px-3 py-1.5 text-xs font-bold tabular-nums text-white">
          {totalSelectedFormats} selected
        </span>
      </div>

      <div
        role="tablist"
        aria-label="Social platforms"
        className="mb-6 flex w-full items-stretch gap-1 border-b border-[#eeebf1] sm:w-fit"
      >
        {PLATFORM_CONFIGS.map((platform) => {
          const isActive = activePlatform === platform.id;
          const selectedCount = form.platformDeliverables[platform.id].length;

          return (
            <button
              key={platform.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActivePlatform(platform.id)}
              className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 px-1.5 py-2.5 text-[10px] font-semibold transition-all duration-200 sm:flex-row sm:flex-none sm:gap-2 sm:px-4 sm:py-3 sm:text-xs ${
                isActive
                  ? "text-[#18005b]"
                  : "text-neutral-400 hover:text-[#222]"
              }`}
            >
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-300 ${
                    isActive
                      ? "border-[#eeeae3] bg-[#fbfaf8] shadow-sm"
                      : "border-transparent bg-transparent"
                  }`}
                >
                  <PlatformLogo
                    platform={platform.id}
                    active={selectedCount > 0 || isActive}
                  />
                </div>

                {selectedCount > 0 && (
                  <span
                    className={`absolute -right-1.5 -top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white px-1 text-[9px] font-bold leading-none sm:hidden ${
                      isActive
                        ? "bg-[#18005b] text-white"
                        : "bg-[#777080] text-white"
                    }`}
                  >
                    {selectedCount}
                  </span>
                )}
              </div>

              <span className="whitespace-nowrap text-center text-[9px] leading-tight sm:text-xs sm:text-left">
                {platform.label}
              </span>

              {selectedCount > 0 && (
                <span
                  className={`hidden h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] sm:inline-flex ${
                    isActive
                      ? "bg-[#18005b] text-white"
                      : "bg-[#eeebf1] text-neutral-600"
                  }`}
                >
                  {selectedCount}
                </span>
              )}

              <span
                className={`absolute bottom-0 left-0 h-[2px] w-full transition-all duration-200 ${
                  isActive ? "bg-[#18005b]" : "bg-transparent"
                }`}
              />
            </button>
          );
        })}
      </div>

      {PLATFORM_CONFIGS.filter(
        (platform) => platform.id === activePlatform,
      ).map((platform) => {
        const selectedFormats = form.platformDeliverables[platform.id];

        return (
          <div key={platform.id} role="tabpanel">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-[#222]">
                  {platform.label} deliverables
                </h4>
                <p className="mt-1 text-xs text-neutral-500">
                  {platform.tagline}
                </p>
              </div>

              <span className="shrink-0 text-[10px] uppercase tracking-wider text-neutral-500">
                {selectedFormats.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {platform.formats.map((format) => {
                const selected = selectedFormats.includes(format);

                return (
                  <button
                    key={format}
                    type="button"
                    onClick={() => onTogglePlatformFormat(platform.id, format)}
                    aria-pressed={selected}
                    className={`group flex min-h-11 items-center gap-3 border px-3 py-2.5 text-left text-xs font-medium transition-all duration-200 ${
                      selected
                        ? "border-[#18005b] bg-[#f5f2fa] text-[#18005b]"
                        : "border-[#eeebf1] bg-white text-neutral-600 hover:border-[#c9c1d8] hover:bg-[#faf9fc]"
                    }`}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
                        selected
                          ? "border-[#18005b] bg-[#18005b]"
                          : "border-[#c9c4cf] bg-white"
                      }`}
                    >
                      {selected && (
                        <Check
                          size={12}
                          strokeWidth={3}
                          className="text-white"
                        />
                      )}
                    </span>

                    <span className="flex-1">{format}</span>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 border-t border-[#eeebf1] pt-3 text-[11px] text-neutral-400">
              {selectedFormats.length === 0
                ? "Select the content formats you're interested in."
                : `${selectedFormats.length} content format${selectedFormats.length > 1 ? "s" : ""} selected for ${platform.label}.`}
            </p>
          </div>
        );
      })}
    </div>
  );
}

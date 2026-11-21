const MARQUEE_ITEMS = Array.from({ length: 7 });

export function BrandMarquee() {
  return (
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
        {MARQUEE_ITEMS.map((_, index) => (
          <div key={index} className="flex shrink-0 items-center gap-6 px-6">
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
  );
}

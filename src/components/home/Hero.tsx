import { ArrowDown } from "lucide-react";
// import { SiInstagram } from "@icons-pack/react-simple-icons";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-[#D8B9E8] px-5 py-12 md:px-16">
      <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
        {/* Text */}
        <div className="order-2 md:order-1">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-[#A83E68]">
            Fashion · Beauty · Lifestyle
          </p>

          <h1 className="font-display text-6xl leading-[0.95] text-[#30152F] md:text-8xl">
            STYLE
            <br />
            IS MY
            <br />
            STORY.
          </h1>

          <p className="mt-7 max-w-md text-base leading-7 text-[#30152F]/75">
            Exploring fashion, beauty and everyday moments. Welcome to my little
            creative world.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/gallery"
              className="rounded-full bg-[#A83E68] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#30152F]"
            >
              Explore My World!
            </a>

            <a
              href="#contact"
              className="rounded-full border border-[#30152F] px-7 py-3 text-sm font-semibold text-[#30152F] transition hover:bg-[#30152F] hover:text-white"
            >
              Collaborate
            </a>
          </div>
        </div>

        {/* Portrait */}
        <div className="relative order-1 flex justify-center md:order-2">
          <div className="absolute h-[290px] w-[290px] rounded-full bg-[#F1DCE3] blur-2xl md:h-[430px] md:w-[430px]" />

          <img
            src="/images/creator/hero.jpg"
            alt="Fashion and lifestyle creator"
            className="relative z-10 aspect-square w-[280px] rounded-full object-cover shadow-2xl md:w-[420px]"
          />

          <span className="absolute -right-1 top-10 z-20 rounded-full bg-[#A83E68] px-5 py-3 text-sm font-semibold text-white md:right-0">
            Be Yourself ✨
          </span>
        </div>
      </div>

      <div className="absolute bottom-5 left-8 hidden items-center gap-2 text-sm text-[#30152F]/70 md:flex">
        <ArrowDown size={16} />
        Scroll to explore
      </div>
    </section>
  );
}

import { ArrowUpRight } from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiPinterest,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
import { socialLinks } from "../../data/content";

const links = [
  ["Instagram", socialLinks.instagram, SiInstagram],
  ["Facebook", socialLinks.facebook, SiFacebook],
  ["YouTube", socialLinks.youtube, SiYoutube],
  ["Pinterest", socialLinks.pinterest, SiPinterest],
];

export function ConnectSection() {
  return (
    <section
      id="connect"
      className="py-[clamp(75px,10vw,135px)] px-[clamp(24px,8vw,140px)] bg-[#fdf8f7] text-[#4a2a2b] text-center"
    >
      <p className="text-[#b58788] uppercase tracking-[2px] text-[14px]">
        Find me online
      </p>

      <h2 className="m-0 font-medium text-[clamp(48px,6vw,84px)] leading-[0.98] [font-family:var(--serif)] tracking-[-3px]">
        Explore my <em className="text-[#d49a89]">world.</em>
      </h2>

      <p className="text-[#525b47] opacity-80 max-w-[500px] mx-auto mt-[24px] mb-[64px] leading-[1.6] text-[18px]">
        Follow along for daily style, beauty notes and a little more of life
        behind the scenes.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-[1000px] mx-auto gap-[1px] p-[1px] overflow-hidden bg-[#4a2a2b]/20">
        {links.map(([name, href, Icon]) => {
          const SocialIcon = Icon as typeof SiInstagram;
          return (
            <a
              href={href as string}
              target="_blank"
              rel="noreferrer"
              key={name as string}
              className="group flex flex-col items-center justify-center gap-[20px] min-h-[168px] py-[28px] px-[14px] bg-[#fdf8f7] text-[#4a2a2b] no-underline transition-all duration-300 ease-[ease] text-[12px] font-semibold tracking-[1.5px] hover:bg-[#b58788] hover:text-white"
            >
              <SocialIcon
                color="currentColor"
                className="transition-colors duration-300 group-hover:text-white"
              />
              <span className="transition-colors duration-300 group-hover:text-white">
                {name as string}
              </span>
              <ArrowUpRight
                size={18}
                className="transition-colors duration-300 group-hover:text-white"
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}

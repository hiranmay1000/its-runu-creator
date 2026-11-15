import { ArrowUpRight, Camera, Play } from "lucide-react";
import { socialLinks } from "../../data/content";
import { SiInstagram } from "@icons-pack/react-simple-icons";

export function InstagramSection() {
  return (
    <section className="reel-section" id="instagram">
      <div className="reel-photo">
        <img
          src="/images/creator/2026-11-14%2023.54.21.jpg"
          alt="Creator in a floral look"
        />
        <button aria-label="Play reel">
          <Play size={26} fill="currentColor" />
        </button>
      </div>
      <div className="reel-copy">
        <Camera size={26} />
        <p className="eyebrow">Come say hi</p>
        <h2>
          More moments,
          <br />
          <em>daily.</em>
        </h2>
        <p>
          Outfits, behind the scenes and little sparks of inspiration — all over
          on Instagram.
        </p>
        <a
          href={socialLinks.instagram}
          className="button button-light"
          target="_blank"
          rel="noreferrer"
        >
          <SiInstagram />
          Follow @itsrunu <ArrowUpRight size={17} />
        </a>
      </div>
    </section>
  );
}

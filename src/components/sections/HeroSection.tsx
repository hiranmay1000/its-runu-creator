import { useEffect, useState, type CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { extractImageColors } from "../../utils/extractImageColor";
import { useBrandTheme } from "../../context/ThemeContext";

const heroSlides = [
  {
    image: "/images/creator/2026-11-14%2023.52.53.jpg",
    alt: "Runu in an elegant black evening gown",
  },
  {
    image: "/images/creator/2026-11-14%2023.53.08.jpg",
    alt: "Runu wearing a chic oversized blazer and tailored trousers",
  },
  {
    image: "/images/creator/2026-11-14%2023.53.18.jpg",
    alt: "Runu in a casual denim jacket and white summer dress",
  },
  {
    image: "/images/creator/2026-11-14%2023.53.22.jpg",
    alt: "Runu posing in a vibrant red silk slip dress",
  },
  {
    image: "/images/creator/2026-11-14%2023.54.12.jpg",
    alt: "Runu in a warm-toned fashion look",
  },
  {
    image: "/images/creator/2026-11-14%2023.54.17.jpg",
    alt: "Runu styling a classic trench coat with leather boots",
  },
  {
    image: "/images/creator/2026-11-14%2023.54.21.jpg",
    alt: "Runu in a bohemian maxi dress with floral accents",
  },
  {
    image: "/images/creator/2026-11-14%2023.54.24.jpg",
    alt: "Runu wearing a sparkling sequin party dress",
  },
  {
    image: "/images/creator/2026-11-14%2023.54.28.jpg",
    alt: "Runu in a sophisticated emerald green velvet suit",
  },
  {
    image: "/images/creator/2026-11-14%2023.54.31.jpg",
    alt: "Runu smiling in a flower-patterned dress",
  },
  {
    image: "/images/creator/2026-11-14%2023.54.40.jpg",
    alt: "Runu modeling a trendy streetwear look with cargo pants",
  },
  {
    image: "/images/creator/2026-11-14%2023.54.45.jpg",
    alt: "Runu in a minimalist white linen two-piece set",
  },
  {
    image: "/images/creator/2026-11-14%2023.54.49.jpg",
    alt: "Runu in a lilac fashion look",
  },
  {
    image: "/images/creator/2026-11-14%2023.54.52.jpg",
    alt: "Runu wearing a cozy oversized knit sweater and skirt",
  },
  {
    image: "/images/creator/2026-11-14%2023.54.55.jpg",
    alt: "Runu in a glamorous gold pleated metallic skirt",
  },
  {
    image: "/images/creator/2026-11-14%2023.54.59.jpg",
    alt: "Runu sporting a vintage-inspired polka dot midi dress",
  },
];

const defaultTheme = {
  background: "#e9b5bd",
  sun: "#f6d9d3",
  accent: "#8d3e4f",
};

export function HeroSection() {
  const { setBrandColor } = useBrandTheme();
  const [slideIndex, setSlideIndex] = useState(0);
  const [theme, setTheme] = useState(defaultTheme);

  const slide = heroSlides[slideIndex];

  // Automatically extract colors whenever the image changes
  useEffect(() => {
    let cancelled = false;

    const updateTheme = async () => {
      try {
        const colors = await extractImageColors(slide.image);
        setBrandColor(colors.background); // Update the brand color in the context

        if (!cancelled) {
          setTheme(colors);
        }
      } catch (error) {
        console.error("Unable to update hero theme:", error);
      }
    };

    updateTheme();

    return () => {
      cancelled = true;
    };
  }, [slide.image]);

  // Random slide transition
  useEffect(() => {
    const interval = window.setInterval(() => {
      setSlideIndex((current) => {
        let next = Math.floor(Math.random() * heroSlides.length);

        if (next === current) {
          next = (current + 1) % heroSlides.length;
        }

        return next;
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  const themeStyles = {
    "--hero-background": `color-mix(in srgb, ${theme.background} 50%, transparent)`,
    "--hero-sun": theme.sun,
    "--hero-accent": theme.accent,
  } as CSSProperties;

  return (
    <section className="hero-section" id="home" style={themeStyles}>
      <div className="hero-copy">
        <p className="eyebrow">Fashion · beauty · lifestyle</p>

        <h1>
          STYLE
          <br />
          IS MY
          <br />
          <em>STORY.</em>
        </h1>

        <p className="intro">
          A little corner of the internet for celebrating personal style,
          everyday beauty and the magic in the in-between.
        </p>

        <div className="hero-actions">
          <a className="button button-dark" href="#connect">
            Explore my world <ArrowUpRight size={17} />
          </a>

          <a className="text-link" href="#contact">
            Let's work together <span>→</span>
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-sun" />

        <div className="arched-frame">
          <img
            key={slide.image}
            className="hero-image"
            src={slide.image}
            alt={slide.alt}
          />
        </div>

        <div className="sticker">
          be
          <br />
          <i>yourself</i> ✦
        </div>

        <p className="vertical-word">CREATIVE LIVING</p>
      </div>

      <a className="scroll-note" href="#about">
        <span /> Scroll to explore
      </a>
    </section>
  );
}

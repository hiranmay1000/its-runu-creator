import { useEffect, useState } from "react"
import { Play } from "lucide-react"
import { looks, socialLinks } from "../../data/content"
import type { InstagramMedia } from "../../types/instagram"

export function InstagramGallery() {
  const [media, setMedia] = useState<InstagramMedia[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/instagram?limit=8", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("No feed")))
      .then((data: { data?: InstagramMedia[] }) => setMedia(data.data ?? []))
      .catch(() => setMedia([]))
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [])

  if (loading) return <div className="instagram-status">Loading the latest from Instagram…</div>
  if (!media.length) return <div className="look-grid">{looks.map((look, index) => <article className={`look look-${index + 1}`} key={look}><img src={look} alt={`Fashion look ${index + 1}`} /><span>{`0${index + 1}`}</span></article>)}</div>

  return <div className="instagram-grid">{media.map((item) => {
    const image = item.thumbnail_url || item.media_url
    const isReel = item.media_product_type === "REELS" || item.media_type === "VIDEO"
    return <a className="instagram-card" key={item.id} href={item.permalink || socialLinks.instagram} target="_blank" rel="noreferrer">
      {image && <img src={image} alt={isReel ? "Instagram reel from _its__runu_" : "Instagram post from _its__runu_"} />}
      {isReel && <span className="reel-badge"><Play size={14} fill="currentColor" /> Reel</span>}
    </a>
  })}</div>
}

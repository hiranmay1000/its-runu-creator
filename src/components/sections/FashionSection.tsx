import { socialLinks } from "../../data/content"
import { InstagramGallery } from "./InstagramGallery"

export function FashionSection() {
  return <section className="fashion-section" id="fashion">
    <div className="section-heading"><div><p className="eyebrow">Style files</p><h2>Latest <em>looks.</em></h2></div><a className="text-link" href={socialLinks.instagram} target="_blank" rel="noreferrer">View all gallery <span>→</span></a></div>
    <InstagramGallery />
  </section>
}

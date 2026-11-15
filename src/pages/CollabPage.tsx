import { ArrowUpRight } from "lucide-react"
import { collaborations } from "../data/collaborations"

export function CollabPage() {
  return <main className="collab-page">
    <section className="collab-hero">
      <p className="eyebrow">Partnerships & campaigns</p>
      <h1>Made to<br /><em>collaborate.</em></h1>
      <p>Selected creative work across fashion, beauty and lifestyle. Each partnership is built around a story worth sharing.</p>
    </section>
    <section className="collab-list" aria-label="Past collaborations">
      <div className="collab-list-heading"><p className="section-label">Selected collaborations</p><p>01 — {String(collaborations.length).padStart(2, "0")}</p></div>
      <div className="collab-grid">{collaborations.map((collab) => <article className="collab-card" key={collab.id}>
        <div className="collab-image"><img src={collab.image} alt="" /><span>{collab.id}</span></div>
        <div className="collab-details"><p>{collab.category} · {collab.year}</p><h2>{collab.partner}</h2><span>{collab.campaign}</span></div>
      </article>)}</div>
    </section>
    <section className="collab-cta"><p className="eyebrow">Have a campaign in mind?</p><h2>Let’s create something<br /><em>memorable.</em></h2><a className="button button-dark" href="mailto:runurabidas2005@gmail.com">Start a conversation <ArrowUpRight size={17} /></a></section>
  </main>
}

import { ArrowUpRight } from "lucide-react"
import { posts } from "../../data/content"

export function JournalSection() {
  return <section className="journal-section" id="journal">
    <div className="section-heading"><div><p className="eyebrow">From the journal</p><h2>Stories & <em>notes.</em></h2></div><a className="text-link" href="#all-posts">View all posts <span>→</span></a></div>
    <div className="post-grid">{posts.map((post) => <article className="post" key={post.title}>
      <div className="post-image"><img src={post.image} alt="" /><span className="post-arrow"><ArrowUpRight size={20} /></span></div>
      <p className="post-tag">{post.tag}</p><h3>{post.title}</h3><a href="#read" className="read-link">Read story →</a>
    </article>)}</div>
  </section>
}

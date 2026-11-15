import { socialLinks } from "../../data/content"
import { Brand } from "./Brand"

export function Footer() {
  return <footer className="footer">
    <a className="brand" href="#home"><Brand /></a>
    <p>© 2026 Runu. Made with intention.</p>
    <div>
      <a href={socialLinks.instagram} target="_blank" rel="noreferrer">Instagram</a>
      <a href={socialLinks.facebook} target="_blank" rel="noreferrer">Facebook</a>
      <a href={socialLinks.youtube} target="_blank" rel="noreferrer">YouTube</a>
    </div>
  </footer>
}

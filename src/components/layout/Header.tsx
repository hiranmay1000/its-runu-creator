import { useState } from "react";
import { Camera, Menu, X } from "lucide-react";
import { Brand } from "./Brand";

const navigation = [
  ["Home", "/"],
  ["About", "/#about"],
  ["Collabs", "/collab"],
  ["Fashion", "/#fashion"],
  ["Contact", "/#contact"],
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <a className="brand" href="/" onClick={closeMenu}>
        <Brand />
      </a>
      <button
        className="menu-button"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle menu"
      >
        {menuOpen ? <X size={23} /> : <Menu size={24} />}
      </button>
      <nav className={menuOpen ? "nav open" : "nav"}>
        {navigation.map(([label, href]) => (
          <a
            className={label === "Collabs" ? "nav-collabs" : undefined}
            href={href}
            onClick={closeMenu}
            key={label}
          >
            {label}
            {label === "Collabs" && <span aria-hidden="true">.☘︎</span>}
          </a>
        ))}
      </nav>
      <a className="header-social" href="/#instagram" aria-label="Instagram">
        <Camera size={19} />
      </a>
    </header>
  );
}

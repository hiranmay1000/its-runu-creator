import { ArrowUpRight, MailPlusIcon } from "lucide-react";

export function ContactSection() {
  return (
    <section className="contact-section" id="contact">
      <p className="eyebrow">Have a project in mind?</p>
      <h2>
        Let's make something
        <br />
        <em>beautiful together.</em>
      </h2>
      <a
        href="mailto:runurabidas2005@gmail.com"
        className="contact-email"
        style={{ fontSize: "0.8rem" }}
      >
        <MailPlusIcon />
        runurabidas2005@gmail.com <ArrowUpRight size={18} />
      </a>
    </section>
  );
}

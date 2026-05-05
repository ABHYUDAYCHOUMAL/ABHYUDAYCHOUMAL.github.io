import { useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { profile, social, env } from "../data/site";
import "./styles/Contact.css";

type Status = "idle" | "sending" | "sent" | "error";

const Contact = () => {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!env.formspreeId) {
      setStatus("error");
      setError("Contact form is not configured.");
      return;
    }

    setStatus("sending");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formspree.io/f/${env.formspreeId}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(
          (json && (json.error || json.errors?.[0]?.message)) ||
            "Failed to send. Please email me directly."
        );
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  return (
    <section className="contact section" id="contact">
      <div className="container contact__inner">
        <header className="contact__header">
          <span className="eyebrow">Contact</span>
          <h2 className="section-title">
            Let's build something that <em>actually ships.</em>
          </h2>
          <p className="contact__lead">
            I'm open to backend / architecture work, interesting integrations,
            and conversations with people who care about systems that hold up.
          </p>
        </header>

        <div className="contact__grid">
          <aside className="contact__info">
            <div className="contact__info-block">
              <span className="mono contact__label">Email</span>
              <a href={`mailto:${profile.email}`} className="contact__value">
                {profile.email}
              </a>
            </div>

            <div className="contact__info-block">
              <span className="mono contact__label">Phone</span>
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="contact__value">
                {profile.phone}
              </a>
            </div>

            <div className="contact__info-block">
              <span className="mono contact__label">Based in</span>
              <span className="contact__value">{profile.location}</span>
            </div>

            <div className="contact__info-block contact__info-block--socials">
              <span className="mono contact__label">Elsewhere</span>
              <ul>
                {[
                  ["GitHub", social.github],
                  ["LinkedIn", social.linkedin],
                  ["LeetCode", social.leetcode],
                  ["Twitter / X", social.twitter],
                ].map(([label, href]) => (
                  <li key={label}>
                    <a href={href} target="_blank" rel="noreferrer">
                      {label} <MdArrowOutward />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <form className="contact__form" onSubmit={onSubmit} noValidate>
            <div className="contact__row">
              <label className="contact__field">
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                />
              </label>
              <label className="contact__field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label className="contact__field">
              <span>Subject</span>
              <input
                type="text"
                name="subject"
                placeholder="What's this about?"
              />
            </label>

            <label className="contact__field">
              <span>Message</span>
              <textarea
                name="message"
                rows={5}
                required
                placeholder="Tell me about the problem, the timeline, and what 'shipped' looks like."
              />
            </label>

            <div className="contact__submit-row">
              <button
                type="submit"
                className="contact__submit"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending..." : "Send message"}
                <MdArrowOutward />
              </button>

              {status === "sent" && (
                <span className="contact__feedback contact__feedback--ok">
                  Sent — I'll be in touch.
                </span>
              )}
              {status === "error" && (
                <span className="contact__feedback contact__feedback--err">
                  {error}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

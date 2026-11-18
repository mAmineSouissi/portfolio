"use client";

import { useRef, useState, type ReactNode } from "react";
import { experience, profile, projects } from "@/lib/data";
import { mergedStore, openPeek, toast, walletOpenStore, resumeOpenStore } from "@/lib/store";
import { TOKENS, huntStore } from "@/lib/tokens";
import Window from "@/components/surface/Window";

type Out = { cmd: string; body: ReactNode };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const COMMANDS = ["help", "hire", "email", "resume", "cv", "ls", "open <project>", "whoami", "tokens", "github", "linkedin", "clear"];

function mail(role?: string) {
  const subject = role ? `Role: ${role}` : "Hello Amine";
  window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}`;
}

function run(raw: string): ReactNode | "clear" {
  const [cmd, ...args] = raw.trim().split(/\s+/);
  const arg = args.join(" ");
  switch ((cmd || "").toLowerCase()) {
    case "":
      return null;
    case "help":
      return (
        <span className="t-com">
          commands: {COMMANDS.join(" · ")}
        </span>
      );
    case "hire": {
      const role = arg.match(/--role\s+(.+)/)?.[1] ?? (arg || undefined);
      mergedStore.set(true);
      toast("Merged hire/you into main. Opening your email.");
      mail(role ? `${role} developer` : undefined);
      return <span className="t-str">✓ merged hire/you into main. composing an email to {profile.email}</span>;
    }
    case "email":
    case "mail":
      mergedStore.set(true);
      mail();
      return <span className="t-str">✓ composing an email to {profile.email}</span>;
    case "resume":
    case "open-resume":
      resumeOpenStore.set(true);
      return <span className="t-str">✓ opened resume.pdf (scroll inside, download from its bar)</span>;
    case "cv": {
      const a = Object.assign(document.createElement("a"), { href: profile.resumeUrl, download: "Mohamed-Amine-Souissi-CV.pdf" });
      a.click();
      return <span className="t-str">✓ downloading resume.pdf</span>;
    }
    case "ls":
      return (
        <span>
          {projects.map((p) => (
            <span key={p.title} className="mr-4 inline-block">
              <span className={p.liveUrl ? "t-str" : "t-fn"}>{slug(p.title)}</span>
            </span>
          ))}
          <span className="block t-com">{"// open <name> to see one. green = live"}</span>
        </span>
      );
    case "open": {
      const p = projects.find((x) => slug(x.title).startsWith(slug(arg)) && arg);
      if (!p) return <span className="t-key">no project matches &quot;{arg}&quot;. try ls</span>;
      openPeek(p.title);
      return <span className="t-str">✓ opened projects/{slug(p.title)}</span>;
    }
    case "whoami":
      return (
        <span>
          {profile.name} · {profile.role} · {profile.location} · {experience.length} roles since 2023 · open to work
        </span>
      );
    case "tokens": {
      const { found } = huntStore.get();
      if (found.length === TOKENS.length) walletOpenStore.set(true);
      return (
        <span>
          {found.length}/{TOKENS.length} tokens mined{found.length === TOKENS.length ? ". opening your wallet" : ". the explorer has hints"}
        </span>
      );
    }
    case "github":
    case "linkedin": {
      const s = profile.socials.find((x) => x.platform.toLowerCase() === cmd.toLowerCase());
      if (s) window.open(s.url, "_blank", "noopener,noreferrer");
      return <span className="t-str">✓ opening {s?.url}</span>;
    }
    case "clear":
      return "clear";
    case "sudo":
      return <span className="t-fn">nice try. ask nicely: hire</span>;
    default:
      return <span className="t-key">command not found: {cmd}. try help</span>;
  }
}

export default function ContactAct() {
  const [value, setValue] = useState("");
  const [out, setOut] = useState<Out[]>([]);
  const input = useRef<HTMLInputElement>(null);

  const submit = (raw: string) => {
    const res = run(raw);
    if (res === "clear") setOut([]);
    else setOut((o) => [...o.slice(-5), { cmd: raw, body: res }]);
    setValue("");
  };

  return (
    <section id="contact" data-file="contact" data-sc-act="pin" data-sc-span="1.3">
      <div data-sc-stage className="stage-pad flex items-center">
        <div className="mx-auto w-full max-w-4xl" data-sc-cue="0 1 0 0">
          <h2 className="headline mb-5 text-[clamp(2rem,5vw,3.8rem)]">Your move.</h2>
          <Window title="contact.sh" right={<span className="t-com">zsh</span>} path={["portfolio", "contact.sh"]}>
            <div className="code px-4 py-5 text-[0.9rem] sm:px-6" onClick={() => input.current?.focus()}>
              <p className="t-com"># {profile.name}, open to full-stack and mobile roles</p>
              <p className="t-com"># try: hire --role mobile · cv · ls · help</p>
              <ul className="mt-3 space-y-2" aria-live="polite">
                {out.map((o, i) => (
                  <li key={i}>
                    <p>
                      <span className="text-[var(--sc-accent)]">~ $</span> {o.cmd}
                    </p>
                    {o.body && <p className="text-[var(--sc-ink)]">{o.body}</p>}
                  </li>
                ))}
              </ul>
              <form
                className="mt-3 flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(value);
                }}
              >
                <label htmlFor="cmd" className="text-[var(--sc-accent)]">
                  ~ $
                </label>
                <input
                  id="cmd"
                  ref={input}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Command. Type help for the list."
                  placeholder="hire --role mobile"
                  className="min-w-0 flex-1 bg-transparent py-1 text-[var(--sc-ink)] outline-none placeholder:text-[var(--syn-com)]"
                />
              </form>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-[var(--sc-hairline)] px-4 py-3 sm:px-6">
              {["hire", "cv", "ls"].map((c) => (
                <button key={c} type="button" onClick={() => submit(c)} className="tech-pill">
                  {c}
                </button>
              ))}
            </div>
          </Window>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a href={`mailto:${profile.email}`} className="btn btn--primary" onClick={() => mergedStore.set(true)}>
              Email me
            </a>
            <a href={profile.resumeUrl} onClick={(e) => { e.preventDefault(); resumeOpenStore.set(true); }} className="btn btn--ghost">
              resume.pdf
            </a>
            <span className="mono text-[0.85rem] text-[var(--sc-ink-soft)]">{profile.email}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

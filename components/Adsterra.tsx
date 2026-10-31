"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

// Adsterra ad units for promptsandtools.online (blog-farm publisher account). Codes come from
// the Adsterra dashboard; keep them on article pages, apart from AdSense units.
const NATIVE_KEY = "34edd8504b413ad9dc6e8e18989b80eb";
const BANNERS = {
  "728x90": "d185f789c56fb35cbe2b549270e92213",
  "300x250": "f64f3b7467bf5e40c1af545002436fcb",
  "320x50": "c10018cbeb40190b5ffac46d950cf639",
} as const;

type BannerSize = keyof typeof BANNERS;

// Each banner gets its own iframe document: Adsterra's snippet reads a global
// `atOptions`, so two banners on one page would otherwise overwrite each other.
function bannerDoc(key: string, width: number, height: number) {
  return `<!doctype html><html><body style="margin:0"><script>atOptions={'key':'${key}','format':'iframe','height':${height},'width':${width},'params':{}};</script><script src="https://bauval.org/22/${key}"></script></body></html>`;
}

function AdLabel() {
  return <p style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.5, margin: "0 0 4px", textAlign: "center" }}>Advertisement</p>;
}

export function AdsterraBanner({ size, className }: { size: BannerSize; className?: string }) {
  const [width, height] = size.split("x").map(Number);
  return (
    <div className={className} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <AdLabel />
      <iframe title="Advertisement" srcDoc={bannerDoc(BANNERS[size], width, height)} width={width} height={height} scrolling="no" style={{ border: 0, display: "block", maxWidth: "100%" }} />
    </div>
  );
}

const desktopQuery = "(min-width: 768px)";
function subscribe(onChange: () => void) {
  const mq = window.matchMedia(desktopQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** In-article slot: 728x90 on desktop, 300x250 on phones. Chosen in the browser so only one unit loads. */
export function AdsterraInline({ className }: { className?: string }) {
  const desktop = useSyncExternalStore(subscribe, () => window.matchMedia(desktopQuery).matches, () => null);
  if (desktop === null) return <div className={className} style={{ minHeight: 90 }} />;
  return <AdsterraBanner key={desktop ? "d" : "m"} size={desktop ? "728x90" : "300x250"} className={className} />;
}

/** Native Banner: one per page (Adsterra targets a fixed container id). */
export function AdsterraNative({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const script = document.createElement("script");
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = `https://bauval.org/21/${NATIVE_KEY}`;
    host.appendChild(script);
    return () => script.remove();
  }, []);
  return (
    <div ref={ref} className={className}>
      <AdLabel />
      <div id={`container-${NATIVE_KEY}`} />
    </div>
  );
}

// 160x600 skyscrapers fixed in the empty margins left and right of the page. Shown only when the
// window leaves room beside the widest content (max-w-6xl), so they never cover text.
const SKYSCRAPER_KEY = "9d2386f86cdb3ecc318477182c6e11d7";
const railQuery = "(min-width: 1520px) and (min-height: 700px)";
function subscribeRails(onChange: () => void) {
  const mq = window.matchMedia(railQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function AdsterraSideRails() {
  const wide = useSyncExternalStore(subscribeRails, () => window.matchMedia(railQuery).matches, () => false);
  if (!wide) return null;
  const rail = (side: "left" | "right") => (
    <div style={{ position: "fixed", top: "50%", [side]: 12, transform: "translateY(-50%)", zIndex: 30 }}>
      <AdLabel />
      <iframe title="Advertisement" srcDoc={bannerDoc(SKYSCRAPER_KEY, 160, 600)} width={160} height={600} scrolling="no" style={{ border: 0, display: "block" }} />
    </div>
  );
  return <>{rail("left")}{rail("right")}</>;
}

// Popunder and Social Bar script URLs from the Adsterra dashboard (GET CODE). Empty = not loaded.
const POPUNDER_SRC = "https://abscloud.org/1/bd6817cd92d97e1da2c1cb5ac908df9c";
const SOCIAL_BAR_SRC = "https://bauval.org/14/adb89870ca41124f509040d433ec8901";
const POP_KEY = "adsterra-pop-day";

function loadScript(src: string) {
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  document.body.appendChild(s);
  return s;
}

/** Popunder, capped to one page load per visitor per day (the script itself decides when it opens). */
export function AdsterraPopunder() {
  useEffect(() => {
    if (!POPUNDER_SRC) return;
    const today = new Date().toISOString().slice(0, 10);
    try {
      if (localStorage.getItem(POP_KEY) === today) return;
      localStorage.setItem(POP_KEY, today);
    } catch {
      return; // no storage = can't cap, so skip
    }
    const s = loadScript(POPUNDER_SRC);
    return () => s.remove();
  }, []);
  return null;
}

export function AdsterraSocialBar() {
  useEffect(() => {
    if (!SOCIAL_BAR_SRC) return;
    const s = loadScript(SOCIAL_BAR_SRC);
    return () => s.remove();
  }, []);
  return null;
}

const SMARTLINK = "https://araplhn.org/4/1c03bc6c61e55cb3008c5dd5e079bd42";

/** Adsterra Smartlink as a clearly labelled sponsored button (never disguised as an article link). */
export function AdsterraSponsoredLink({ className }: { className?: string }) {
  return (
    <div className={className} style={{ textAlign: "center" }}>
      <AdLabel />
      <a href={SMARTLINK} target="_blank" rel="sponsored nofollow noopener" style={{ display: "inline-block", padding: "12px 22px", borderRadius: 8, border: "1px solid currentColor", fontWeight: 600, fontSize: 15, opacity: 0.85 }}>
        Sponsored: today&apos;s featured offer →
      </a>
    </div>
  );
}

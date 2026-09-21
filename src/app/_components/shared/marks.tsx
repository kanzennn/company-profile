import type { GlyphId } from "../../_lib/content/types";

const paths: Record<GlyphId, React.ReactNode> = {
  kervzent: (
    <path d="M4 2h6.4v11.1L21.2 2H29L18.4 13.9 29 30h-7.6l-7.4-11.2-3.6 3.9V30H4V2Z" />
  ),
  web: (
    <>
      <path d="M2 4h28v24H2V4Zm2.4 6.4v15.2h23.2V10.4H4.4Z" />
      <circle cx="6.6" cy="7.2" r="1.3" />
      <circle cx="10.8" cy="7.2" r="1.3" />
      <circle cx="15" cy="7.2" r="1.3" />
    </>
  ),
  mobile: (
    <>
      <path d="M9 1h14a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Zm0 2.4a.6.6 0 0 0-.6.6v24a.6.6 0 0 0 .6.6h14a.6.6 0 0 0 .6-.6V4a.6.6 0 0 0-.6-.6H9Z" />
      <path d="M13 5.6h6V7h-6z" />
      <circle cx="16" cy="25.6" r="1.6" />
    </>
  ),
  ai: (
    <path d="M16 1.5l3 8.1a6 6 0 0 0 3.4 3.4l8.1 3-8.1 3a6 6 0 0 0-3.4 3.4l-3 8.1-3-8.1a6 6 0 0 0-3.4-3.4l-8.1-3 8.1-3a6 6 0 0 0 3.4-3.4l3-8.1Z" />
  ),
  chat: (
    <path d="M4 4h24a2.6 2.6 0 0 1 2.6 2.6v13.2A2.6 2.6 0 0 1 28 22.4H14.6L6 29v-6.6H4a2.6 2.6 0 0 1-2.6-2.6V6.6A2.6 2.6 0 0 1 4 4Z" />
  ),
};

export function Glyph({ id, className }: { id: GlyphId; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      {paths[id]}
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 ${className ?? ""}`}>
      <Glyph id="kervzent" className="h-7 w-7 shrink-0 text-primary" />
      <span className="text-title font-medium tracking-[-0.04em] lg:text-[1.75rem]">
        Kervzent
      </span>
      <span className="font-mono text-label uppercase tracking-[0.3em] opacity-60">
        Studio
      </span>
    </span>
  );
}

export function CornerMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 30 30"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M14.5 0h1v30h-1z" />
      <path d="M30 14.5v1H0v-1z" />
    </svg>
  );
}

export function CornerMarks({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute grid grid-cols-[auto_auto] content-between justify-between ${className ?? ""}`}
    >
      <CornerMark className="h-[30px] w-[30px]" />
      <CornerMark className="h-[30px] w-[30px]" />
      <CornerMark className="h-[30px] w-[30px]" />
      <CornerMark className="h-[30px] w-[30px]" />
    </div>
  );
}

// Minimal HTML sanitizer for user-authored bio content (TipTap output). It
// drops <script>/<style> blocks entirely, removes any tag outside a small
// allowlist (keeping inner text), and strips ALL attributes from allowed tags —
// which neutralizes event handlers and javascript: URLs. The bio editor only
// emits these structural tags, so formatting is preserved.

const ALLOWED = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "s",
  "u",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "blockquote",
  "code",
  "pre",
]);

export function sanitizeBioHtml(html: string): string {
  if (!html) return "";
  // Remove dangerous element blocks with their contents.
  let s = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");
  // Keep only allowlisted tags, with no attributes; drop others (text remains).
  s = s.replace(/<\/?([a-zA-Z0-9]+)(?:\s[^>]*)?>/g, (_match, rawTag: string) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED.has(tag)) return "";
    return _match.startsWith("</") ? `</${tag}>` : `<${tag}>`;
  });
  return s;
}

import sanitizeHtml from "sanitize-html";

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = Object.freeze({
  allowedTags: ["b", "i", "em", "strong", "p", "br", "span", "a"],
  allowedAttributes: {
    a: ["href", "title", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  allowedSchemesByTag: {},
  disallowEmpty: false,
  transformTags: {
    a: (_tagName: string, attribs: Record<string, string>) => ({
      tagName: "a",
      attribs: {
        ...attribs,
        href: attribs.href,
        title: attribs.title,
        rel: "nofollow noopener noreferrer",
      },
    }),
  },
});

/** Sanitización con lista blanca revisada por el proyecto — no usar HTML crudo sin esto. */
export function sanitizeUserHtml(dirty: string): string {
  return sanitizeHtml(dirty, SANITIZE_OPTIONS);
}

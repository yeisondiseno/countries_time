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

/** Opciones de `sanitize-html` para inputs: sin tags ni atributos. */
const INPUT_SANITIZE_OPTIONS: sanitizeHtml.IOptions = Object.freeze({
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: "discard",
  allowedSchemes: [],
  allowProtocolRelative: false,
  parseStyleAttributes: false,
});

const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

const INPUT_MAX_LENGTH = Object.freeze({
  search: 200,
  text: 500,
  date: 10,
  time: 5,
} as const);

const INPUT_CHARSET = Object.freeze({
  date: /[^\d-]/g,
  time: /[^\d:]/g,
} as const);

type SanitizableInputType = keyof typeof INPUT_MAX_LENGTH | (string & {});

/** Sanitización con lista blanca revisada por el proyecto — no usar HTML crudo sin esto. */
export function sanitizeUserHtml(dirty: string): string {
  return sanitizeHtml(dirty, SANITIZE_OPTIONS);
}

/** Paso 1: `sanitize-html` elimina markup; luego se quitan caracteres de control. */
function stripInputMarkup(dirty: string): string {
  return sanitizeHtml(dirty, INPUT_SANITIZE_OPTIONS).replace(CONTROL_CHARS, "");
}

/**
 * Normaliza el valor de un `<input>` según su `type`.
 * Espera texto ya pasado por `sanitizeUserHtml` cuando el origen es HTML.
 */
export function sanitizeInputValue(
  dirty: string,
  type: SanitizableInputType = "text",
): string {
  const withoutMarkup = stripInputMarkup(dirty);

  if (type === "date") {
    return withoutMarkup
      .replace(INPUT_CHARSET.date, "")
      .slice(0, INPUT_MAX_LENGTH.date);
  }

  if (type === "time") {
    return withoutMarkup
      .replace(INPUT_CHARSET.time, "")
      .slice(0, INPUT_MAX_LENGTH.time);
  }

  const max =
    type === "search" ? INPUT_MAX_LENGTH.search : INPUT_MAX_LENGTH.text;

  return withoutMarkup.slice(0, max);
}

/** Pipeline completo para valores de `<input>`: HTML seguro → texto plano → reglas por `type`. */
export function sanitizeInputChange(
  value: string,
  type: SanitizableInputType = "text",
): string {
  return sanitizeInputValue(sanitizeUserHtml(value), type);
}

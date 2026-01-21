const SMALL_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "from",
  "in",
  "into",
  "nor",
  "of",
  "on",
  "or",
  "over",
  "per",
  "the",
  "to",
  "up",
  "via",
  "with",
]);

function isAllCaps(word: string) {
  return /^[A-Z0-9]+$/.test(word) && /[A-Z]/.test(word);
}

function titleCaseHyphenated(word: string) {
  return word
    .split("-")
    .map((part) => {
      if (!part) return part;
      if (isAllCaps(part)) return part; // keep acronyms like RDL, DB
      const lower = part.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join("-");
}

/** "Machine chest press" -> "Machine Chest Press" */
export function normalizeExerciseName(input: string) {
  const cleaned = input.trim().replace(/\s+/g, " ");
  if (!cleaned) return cleaned;

  const words = cleaned.split(" ");
  return words
    .map((w, idx) => {
      if (isAllCaps(w)) return w;

      const lower = w.toLowerCase();
      const isFirst = idx === 0;
      const isLast = idx === words.length - 1;

      if (!isFirst && !isLast && SMALL_WORDS.has(lower)) return lower;
      return titleCaseHyphenated(w);
    })
    .join(" ");
}

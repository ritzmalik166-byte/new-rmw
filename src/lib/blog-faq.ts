export type BlogFaq = { question: string; answer: string };

type Block = { level: number; html: string; text: string };

const BLOCK_RE = /<(h[1-6]|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
const FAQ_HEADING_RE = /frequently\s+asked\s+questions|\bfaqs?\b/i;
const FAQ_MARKER_MAX_LENGTH = 120;
const QUESTION_PREFIX_RE = /^(?:Q(?:uestion)?\s*\d*\s*[.:)\-]|\d+\s*[.)])\s*/i;
const ANSWER_PREFIX_RE = /^A(?:ns(?:wer)?)?\s*[.:)\-]\s*/i;
const LEADING_BOLD_RE = /^\s*(?:<span\b[^>]*>\s*)*<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/i;

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "\u2019",
  lsquo: "\u2018",
  rdquo: "\u201d",
  ldquo: "\u201c",
  ndash: "\u2013",
  mdash: "\u2014",
  hellip: "\u2026",
};

function decodeEntities(text: string) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const point =
        code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isNaN(point) ? match : String.fromCodePoint(point);
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

export function htmlToText(html: string) {
  return decodeEntities(
    html
      .replace(/<(?:br|\/?(?:p|div|li|ul|ol|h[1-6]|tr|td|th))\b[^>]*>/gi, " ")
      .replace(/<[^>]*>/g, ""),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function toBlocks(html: string) {
  const blocks: Block[] = [];
  for (const match of html.matchAll(BLOCK_RE)) {
    const tag = match[1].toLowerCase();
    const text = htmlToText(match[2]);
    if (!text) continue;
    blocks.push({ level: tag[0] === "h" ? Number(tag[1]) : 0, html: match[2], text });
  }
  return blocks;
}

/* Last FAQ heading wins so a table-of-contents "FAQs" entry is ignored. */
function findFaqMarker(blocks: Block[]) {
  let paragraphMarker = -1;
  for (let i = blocks.length - 1; i >= 0; i -= 1) {
    const { level, text } = blocks[i];
    if (!FAQ_HEADING_RE.test(text)) continue;
    if (level > 0) return i;
    if (paragraphMarker < 0 && text.length <= FAQ_MARKER_MAX_LENGTH) paragraphMarker = i;
  }
  return paragraphMarker;
}

function splitInlineQuestion(block: Block): [string, string] | null {
  const bold = block.html.match(LEADING_BOLD_RE);
  if (bold) {
    const question = htmlToText(bold[2]);
    if (question.endsWith("?") && block.text.startsWith(question)) {
      return [question, block.text.slice(question.length)];
    }
  }

  if (QUESTION_PREFIX_RE.test(block.text)) {
    const end = block.text.indexOf("?");
    if (end > 0) return [block.text.slice(0, end + 1), block.text.slice(end + 1)];
  }

  return null;
}

/* Pulls question/answer pairs out of a post's "FAQs" / "Frequently Asked Questions"
   section: sub-heading questions, bold or numbered inline questions, and alternating
   question/answer paragraphs. */
export function extractFaqsFromHtml(html: string): BlogFaq[] {
  const blocks = toBlocks(html);
  const markerIndex = findFaqMarker(blocks);
  if (markerIndex < 0) return [];

  const sectionLevel = blocks[markerIndex].level || 2;
  const section: Block[] = [];
  for (let i = markerIndex + 1; i < blocks.length; i += 1) {
    const block = blocks[i];
    if (block.level > 0 && block.level <= sectionLevel) break;
    section.push(block);
  }

  const useHeadings = section.some((block) => block.level > 0);
  const faqs: BlogFaq[] = [];
  let current: { question: string; answer: string[] } | null = null;

  const pushCurrent = () => {
    if (!current) return;
    const question = current.question.replace(QUESTION_PREFIX_RE, "").trim();
    const answer = current.answer.join(" ").replace(/\s+/g, " ").trim().replace(ANSWER_PREFIX_RE, "");
    if (question && answer) faqs.push({ question, answer });
    current = null;
  };

  for (const block of section) {
    if (useHeadings) {
      if (block.level > 0) {
        pushCurrent();
        current = { question: block.text, answer: [] };
      } else if (current) {
        current.answer.push(block.text);
      }
      continue;
    }

    if (block.text.endsWith("?")) {
      pushCurrent();
      current = { question: block.text, answer: [] };
      continue;
    }

    const inline = splitInlineQuestion(block);
    if (inline) {
      pushCurrent();
      current = { question: inline[0], answer: [inline[1]] };
      continue;
    }

    if (current) current.answer.push(block.text);
  }
  pushCurrent();

  return faqs;
}

// Парсер структурированного описания товара.
// Формат (markdown-подобный, хранится в поле products.description):
//   <вводный абзац(ы)>
//   ## Преимущества
//   - пункт
//   ## Сферы применения
//   - пункт
//   ## FAQ
//   Q: вопрос?
//   A: ответ
//   ## Поставка и монтаж
//   <абзац>
// Обратная совместимость: текст без "## " отдаётся как один вводный блок.

export type RichSection = { title: string; items: string[]; isList: boolean };
export type RichFaq = { q: string; a: string };
export type RichDescriptionData = {
  overview: string;
  sections: RichSection[];
  faq: RichFaq[];
  isStructured: boolean;
};

export function parseRichDescription(raw: string | null | undefined): RichDescriptionData {
  const text = (raw ?? "").replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  const overview: string[] = [];
  const sections: RichSection[] = [];
  const faq: RichFaq[] = [];
  let mode: "overview" | "section" | "faq" = "overview";
  let cur: RichSection | null = null;
  let started = false;
  let pendingQ: string | null = null;

  for (const line of lines) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) {
      const title = h[1].trim();
      if (/^faq$/i.test(title) || /вопрос/i.test(title)) {
        mode = "faq";
        cur = null;
      } else {
        cur = { title, items: [], isList: false };
        sections.push(cur);
        mode = "section";
        started = false;
      }
      continue;
    }
    if (mode === "overview") {
      if (line.trim()) overview.push(line.trim());
    } else if (mode === "section" && cur) {
      const m = line.match(/^\s*[-•]\s+(.+?)\s*$/);
      if (m) {
        if (!started) {
          cur.isList = true;
          started = true;
        }
        cur.items.push(m[1].trim());
      } else if (line.trim()) {
        started = true;
        cur.items.push(line.trim());
      }
    } else if (mode === "faq") {
      const q = line.match(/^\s*Q:\s*(.+?)\s*$/i);
      const a = line.match(/^\s*A:\s*(.+?)\s*$/i);
      if (q) {
        pendingQ = q[1].trim();
      } else if (a && pendingQ != null) {
        faq.push({ q: pendingQ, a: a[1].trim() });
        pendingQ = null;
      } else if (line.trim() && faq.length && pendingQ == null) {
        // продолжение многострочного ответа
        faq[faq.length - 1].a += " " + line.trim();
      }
    }
  }

  const isStructured = sections.length > 0 || faq.length > 0;
  return { overview: overview.join("\n\n"), sections, faq, isStructured };
}

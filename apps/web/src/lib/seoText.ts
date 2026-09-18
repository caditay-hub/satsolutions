// Мета-описание в выдаче обрезается примерно на 160 символах, а заголовок — на 60–65.
// Тексты на странице оставляем полными, а в <title> и description отдаём укладывающийся
// в выдачу вариант: режем по границе предложения, иначе по границе слова.

export function clampDesc(text: string, max = 158): string {
  const s = text.trim();
  if (s.length <= max) return s;
  const head = s.slice(0, max);
  const sentence = Math.max(head.lastIndexOf(". "), head.lastIndexOf("。"), head.lastIndexOf("! "), head.lastIndexOf("? "));
  if (sentence > max * 0.55) return s.slice(0, sentence + 1).trim();
  const space = head.lastIndexOf(" ");
  return (space > 0 ? head.slice(0, space) : head).trim() + "…";
}

export function clampTitle(text: string, max = 62): string {
  const s = text.trim();
  if (s.length <= max) return s;
  const head = s.slice(0, max);
  // заголовки статей построены как «Тема: уточнение» — при переборе оставляем тему
  const colon = s.indexOf(": ");
  if (colon > 20 && colon <= max) return s.slice(0, colon);
  const space = head.lastIndexOf(" ");
  return (space > 0 ? head.slice(0, space) : head).trim() + "…";
}

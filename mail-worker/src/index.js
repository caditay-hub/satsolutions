import PostalMime from 'postal-mime';

/**
 * Почта sales@satsolutions.uz → тема «📧 Почта» в Telegram-группе заявок.
 *
 * Ящик живёт в VK WorkMail на бесплатном тарифе: IMAP для внешних программ там закрыт.
 * Поэтому в самом ящике включена пересылка всех писем на служебный адрес поддомена,
 * который принимает Cloudflare Email Routing и передаёт сюда. Оригинал письма остаётся
 * в sales@ — отвечать оттуда же. Здесь только уведомление: тема, отправитель, суть
 * текста, вложения файлами ответом на уведомление.
 *
 * Решение владельца 14.09.2026: «бесплатно, через пересылку».
 */

const TEXT_LIMIT = 1500;
const FILE_LIMIT = 20 * 1024 * 1024; // больше Telegram от бота не принимает
const FILES_MAX = 10;
const INBOX_URL = 'https://e.mail.ru/inbox/';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * HTML-коды в обычные символы. Нужны и для текстовой части: робот mail.ru кладёт туда
 * ссылку с «&amp;» — без раскодирования ссылка подтверждения пересылки ломалась (14.09).
 */
function decodeEntities(s) {
  return String(s || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&amp;/g, '&');
}

/** HTML в читаемый текст — для писем без текстовой части. Цитату (<blockquote>) отрезаем сразу. */
function htmlToText(html) {
  return decodeEntities(
    String(html || '')
      .replace(/<(script|style|head)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .split(/<blockquote/i)[0]
      .replace(/<br\s*\/?>|<\/p>|<\/div>|<\/tr>|<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  );
}

/** Суть нового письма: без цитат прошлой переписки и лишних пустых строк. */
function preview(text) {
  let t = String(text || '').replace(/\r/g, '').replace(/[ \t ]+/g, ' ');
  t = t.split('\n').map((l) => l.trim()).join('\n');
  t = ('\n' + t).split(
    /\n>|\n-{2,}\s*Original|\n-{2,}\s*Исходное|\n-{2,}\s*Пересылаемое|\nFrom: .*\nSent: |\n\d{1,2}[./]\d{1,2}[./]\d{2,4}.{0,40}(?:пишет|wrote):/,
  )[0];
  t = t.replace(/\n\s*\n+/g, '\n\n').trim();
  if (t.length > TEXT_LIMIT) t = t.slice(0, TEXT_LIMIT).replace(/\s+\S*$/, '') + '…';
  return t;
}

/** Вне Пн–Пт 9–18 по Ташкенту (UTC+5) — без звука, как у заявок в боте. */
function quietNow() {
  const d = new Date(Date.now() + 5 * 3600 * 1000);
  const day = d.getUTCDay();
  const h = d.getUTCHours();
  return day === 0 || day === 6 || h < 9 || h >= 18;
}

function tashkentTime(date) {
  const t = Date.parse(date || '');
  if (!t) return '';
  const d = new Date(t + 5 * 3600 * 1000);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`;
}

/** Вложения: логотипы из подписи (мелкие картинки внутри письма) не нужны. */
export function pickFiles(attachments) {
  const files = [];
  const skipped = [];
  for (const a of attachments || []) {
    const size = a.content ? a.content.byteLength ?? a.content.length ?? 0 : 0;
    const inlineImage = (a.disposition === 'inline' || a.related) && /^image\//.test(a.mimeType || '');
    if (inlineImage && size < 30 * 1024) continue;
    const name = a.filename || (inlineImage ? 'image' : 'file');
    if (size <= FILE_LIMIT && files.length < FILES_MAX) files.push({ ...a, filename: name });
    else skipped.push(name);
  }
  return { files, skipped };
}

export function formatNotice(parsed, envelopeFrom, files, skipped) {
  const f = parsed.from || {};
  const sender = f.address ? (f.name ? `${esc(f.name)} &lt;${esc(f.address)}&gt;` : esc(f.address)) : esc(envelopeFrom);
  const lines = [`📧 <b>${esc(parsed.subject || '(без темы)')}</b>`, `👤 ${sender}`];
  const cc = (parsed.cc || []).map((a) => a.address).filter(Boolean);
  if (cc.length) lines.push(`👥 Копия: ${esc(cc.slice(0, 5).join(', '))}${cc.length > 5 ? ' …' : ''}`);
  const when = tashkentTime(parsed.date);
  if (when) lines.push(`🕒 ${when}`);
  const text = preview(parsed.text && parsed.text.trim() ? decodeEntities(parsed.text) : htmlToText(parsed.html));
  if (text) lines.push('', esc(text));
  const total = files.length + skipped.length;
  if (total) {
    let att = `📎 Вложения: ${total}`;
    if (skipped.length) att += ` (не пришлю — слишком большие или больше ${FILES_MAX}: ${esc(skipped.join(', '))})`;
    lines.push('', att);
  }
  return lines.join('\n').slice(0, 4000);
}

async function tg(env, method, body) {
  const isForm = body instanceof FormData;
  const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: isForm ? undefined : { 'content-type': 'application/json' },
    body: isForm ? body : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) throw new Error(`${method}: ${data.description || res.status}`);
  return data.result;
}

async function postNotice(env, html) {
  const base = {
    chat_id: env.TELEGRAM_CHAT_ID,
    text: html,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    disable_notification: quietNow(),
    reply_markup: { inline_keyboard: [[{ text: '✉️ Открыть почту', url: INBOX_URL }]] },
  };
  try {
    return await tg(env, 'sendMessage', { ...base, message_thread_id: Number(env.TELEGRAM_THREAD_ID) });
  } catch (e) {
    // тему удалили — письмо не теряем, шлём в общий чат группы
    if (!/thread not found/i.test(e.message)) throw e;
    console.error('тема «Почта» не найдена, шлю в General');
    return tg(env, 'sendMessage', { ...base, text: '⚠️ Тема «📧 Почта» удалена — письмо здесь.\n\n' + html });
  }
}

async function postFile(env, notice, file) {
  const form = new FormData();
  form.append('chat_id', env.TELEGRAM_CHAT_ID);
  if (notice.message_thread_id) form.append('message_thread_id', String(notice.message_thread_id));
  form.append('disable_notification', 'true');
  form.append('reply_parameters', JSON.stringify({ message_id: notice.message_id }));
  form.append('document', new Blob([file.content], { type: file.mimeType || 'application/octet-stream' }), file.filename);
  await tg(env, 'sendDocument', form);
}

export default {
  async email(message, env) {
    let parsed = {};
    try {
      parsed = await PostalMime.parse(await new Response(message.raw).arrayBuffer());
    } catch (e) {
      console.error('не разобрал письмо', e);
    }
    const { files, skipped } = pickFiles(parsed.attachments);
    const notice = await postNotice(env, formatNotice(parsed, message.from, files, skipped));
    for (const file of files) {
      try {
        await postFile(env, notice, file);
      } catch (e) {
        console.error('вложение не ушло', file.filename, e.message);
      }
    }
  },
};

# Правила проекта satsolutions

## 🚫 ЗАПРЕТ НА ТРАТУ ДЕНЕГ CLAUDE API (КРИТИЧЕСКОЕ ПРАВИЛО)

**Любое использование платного Claude API (Anthropic API) — ТОЛЬКО после ДВОЙНОГО явного разрешения владельца.**

Это значит:

1. Claude (в любой сессии, любом чате, Claude Code, агентах, скриптах, cron-задачах) **КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО** самостоятельно вызывать платный Anthropic API, тратить кредиты/баланс API или запускать код, который это делает.
2. Перед ЛЮБЫМ действием, которое может потратить деньги API (вызов `api.anthropic.com`, использование `@anthropic-ai/sdk`, `anthropic` SDK, `ant` CLI с реальными запросами, Managed Agents, батчи и т.п.), Claude обязан:
   - **Шаг 1:** спросить у владельца разрешение и получить явное «да»;
   - **Шаг 2:** переспросить ещё раз («Точно запускаем? Это потратит деньги API») и получить **второе** явное подтверждение.
3. Без двух подтверждений в текущем разговоре — действие не выполняется. Разрешение из прошлых сессий/чатов НЕ считается.
4. Это правило распространяется на: написание И запуск тестовых скриптов с API-вызовами, «проверку ключа», «один маленький запрос», прогрев кэша, count_tokens с реальным ключом — всё, что уходит на серверы Anthropic с биллингом.
5. Писать код, использующий Claude API, МОЖНО — запускать его без двойного разрешения НЕЛЬЗЯ.

## 🚫 CLAUDE API SPENDING BAN (CRITICAL RULE — English duplicate)

**Any use of the paid Anthropic/Claude API requires DOUBLE explicit permission from the owner, obtained in the current conversation.**

- Claude (any session, chat, Claude Code, subagent, script, or scheduled task) is **STRICTLY FORBIDDEN** from spending API money autonomously.
- Before any action that could incur API charges (calls to `api.anthropic.com`, running code that uses the Anthropic SDK / `ant` CLI, Managed Agents, batches, token counting with a real key, cache pre-warming, "just one small test request"):
  1. Ask the owner and receive an explicit "yes".
  2. Ask a second confirmation ("This will spend API money — confirm again?") and receive a **second** explicit "yes".
- No double confirmation in the current conversation → do not execute. Permissions from past sessions do not carry over.
- Writing API-related code is allowed; executing it against the paid API without double permission is not.

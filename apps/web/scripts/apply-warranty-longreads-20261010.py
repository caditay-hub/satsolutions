"""Гарантия 3 года на монтажные работы в лонгридах категорий — переводы uz/en/tr/zh.

Владелец подтвердил срок 10.10.2026. В 11 лонгридах фраза о гарантии на монтаж была без срока
(«собственная гарантия, условия уточняйте у менеджера»). Русский оригинал живёт в БД
(site_pages category:<slug>) и правится seed-скриптом apps/api/src/seed-warranty-longreads-20261010.ts,
переводы — здесь, в apps/web/src/data/categoryLongreadI18n.json. Данные замен общие:
apps/api/src/seed-warranty-longreads-20261010.json.

Сухой прогон по умолчанию, запись только с --apply. Идемпотентно: уже заменённое пропускается.
Запуск из корня репо: python apps/web/scripts/apply-warranty-longreads-20261010.py [--apply]
"""
import io
import json
import sys

APPLY = "--apply" in sys.argv
DATA = "apps/api/src/seed-warranty-longreads-20261010.json"
TARGET = "apps/web/src/data/categoryLongreadI18n.json"

rep = json.load(io.open(DATA, encoding="utf-8"))
src = io.open(TARGET, encoding="utf-8").read()
tr = json.loads(src)
todo = errors = 0
for slug, langs in rep.items():
    for lang in ("uz", "en", "tr", "zh"):
        old, new = langs[lang]["old"], langs[lang]["new"]
        text = (tr.get(slug) or {}).get(lang) or ""
        if new in text and old not in text:
            print(f"= {slug}/{lang}: уже так")
            continue
        n = text.count(old)
        if n != 1:
            print(f"✗ {slug}/{lang}: исходная фраза найдена {n} раз — стоп")
            errors += 1
            continue
        tr[slug][lang] = text.replace(old, new)
        todo += 1
        print(f"{slug}/{lang}\n  было  {old}\n  стало {new}")
if errors:
    sys.exit(f"\nОШИБОК: {errors} — ничего не записано")
if APPLY and todo:
    io.open(TARGET, "w", encoding="utf-8", newline="").write(json.dumps(tr, ensure_ascii=False))
print(f"\n{'ЗАПИСАНО' if APPLY else 'Сухой прогон, будет изменено'}: {todo}")

# B0: текст всех скачанных datasheet (pypdf) → pdf/<slug>.txt
import pathlib, sys
from pypdf import PdfReader

d = pathlib.Path(sys.argv[1])
ok = bad = 0
for f in sorted(d.glob("*.pdf")):
    out = f.with_suffix(".txt")
    if out.exists():
        continue
    try:
        text = "\n".join((p.extract_text() or "") for p in PdfReader(str(f)).pages)
        out.write_text(text, encoding="utf-8")
        ok += 1
    except Exception as e:  # битый PDF — фиксируем и идём дальше
        out.write_text(f"!!ERROR {e}", encoding="utf-8")
        bad += 1
print("pdf->txt ok", ok, "bad", bad)

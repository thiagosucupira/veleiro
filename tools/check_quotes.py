#!/usr/bin/env python3
"""Checagem determinística das citações da pesquisa (camada extra antes dos dois verificadores humanos/agentes).

Para cada afirmação em research/_work/research_*.json, procura o trecho literal ("quote") no texto da fonte:
- NORMAM-211/212: acervo local (research/acervo), PDF consolidado e anexos .odt;
- demais URLs: cache do serviço de busca (fetchsvc) ou download agora (marinha.mil.br via fetchsvc; outros via curl).
Saída: research/_work/quotecheck.json  {id: {found, how, have_text, context}}
Uso: python3 tools/check_quotes.py [--cache DIR] [--fetch]
"""
import argparse, glob, hashlib, html, json, os, re, subprocess, sys, unicodedata
from html.parser import HTMLParser
from urllib.parse import quote as urlq

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W = os.path.join(ROOT, "research", "_work")
AC = os.path.join(ROOT, "research", "acervo")
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36"


class Txt(HTMLParser):
    def __init__(self):
        super().__init__(); self.out = []; self.skip = 0
    def handle_starttag(self, t, a):
        if t in ("script", "style", "noscript"): self.skip += 1
        if t in ("p", "br", "div", "li", "tr", "h1", "h2", "h3", "h4", "td"): self.out.append("\n")
    def handle_endtag(self, t):
        if t in ("script", "style", "noscript") and self.skip: self.skip -= 1
    def handle_data(self, d):
        if not self.skip: self.out.append(d)


def html_to_text(raw):
    p = Txt(); p.feed(raw); return "".join(p.out)


def strict(s):
    s = unicodedata.normalize("NFKC", s)
    s = s.replace("“", '"').replace("”", '"').replace("‘", "'").replace("’", "'").replace("–", "-").replace("—", "-")
    s = re.sub(r"-\s*\n\s*", "", s)
    return re.sub(r"\s+", " ", s).strip().lower()


def loose(s):
    s = strict(s)
    s = "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", " ", s).strip()


def segmentos(q):
    partes = re.split(r"\[\s*(?:\.\.\.|…)\s*\]|\(\s*(?:\.\.\.|…)\s*\)|\.\.\.|…", q or "")
    return [p.strip(" \"'“”") for p in partes if len(loose(p)) >= 12]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cache", default=None, help="diretório de cache do fetchsvc (page_*.json / pdf_*.json)")
    ap.add_argument("--fetch", action="store_true", help="baixar fontes que não estão em cache")
    ap.add_argument("--dl", default=os.path.join(W, "fontes_cache"))
    a = ap.parse_args()
    os.makedirs(a.dl, exist_ok=True)

    textos = {}
    normam = open(os.path.join(AC, "normam-211.txt"), errors="replace").read()
    anexos = "\n".join(open(f, errors="replace").read() for f in sorted(glob.glob(os.path.join(AC, "normam211_anexos", "*.txt"))))
    n211 = normam + "\n" + anexos
    n212 = open(os.path.join(AC, "normam-212.txt"), errors="replace").read() if os.path.exists(os.path.join(AC, "normam-212.txt")) else ""
    if a.cache:
        for f in glob.glob(os.path.join(a.cache, "*.json")):
            try:
                d = json.load(open(f))
            except Exception:
                continue
            if d.get("url") and d.get("text"):
                textos[d["url"]] = d["text"]
    for f in glob.glob(os.path.join(a.dl, "*.json")):
        d = json.load(open(f)); textos[d["url"]] = d["text"]

    def obter(url):
        if not url: return ""
        u = url.lower()
        if "normam-211" in u or "normam211" in u or "normam-211-anexos" in u: return n211
        if "normam-212" in u: return n212
        if url in textos: return textos[url]
        base = url.split("#")[0]
        if base in textos: return textos[base]
        if not a.fetch: return ""
        h = hashlib.sha1(url.encode()).hexdigest()[:16]
        txt = ""
        try:
            if "marinha.mil.br" in u and not u.endswith(".pdf"):
                r = subprocess.run(["curl", "-s", "-G", "localhost:8799/page", "--data-urlencode", "url=" + url], capture_output=True, text=True, timeout=120)
                txt = json.loads(r.stdout).get("text", "") if r.stdout.strip().startswith("{") else ""
            else:
                dest = os.path.join(a.dl, h + ".bin")
                src = url.replace("://www.marinha.mil.br/", "://assets.marinha.mil.br/")
                subprocess.run(["curl", "-skL", "--max-time", "90", "-A", UA, "-o", dest, src], timeout=120)
                if os.path.exists(dest):
                    raw = open(dest, "rb").read()
                    if raw[:4] == b"%PDF":
                        subprocess.run(["pdftotext", "-layout", dest, dest + ".txt"], timeout=120)
                        txt = open(dest + ".txt", errors="replace").read() if os.path.exists(dest + ".txt") else ""
                    else:
                        txt = html_to_text(raw.decode("utf-8", errors="replace"))
        except Exception as e:
            print("falha", url, e, file=sys.stderr)
        textos[url] = txt
        json.dump({"url": url, "text": txt}, open(os.path.join(a.dl, h + ".json"), "w"))
        return txt

    out, stats = {}, {"found_strict": 0, "found_loose": 0, "not_found": 0, "no_text": 0, "no_quote": 0}
    cache_norm = {}
    for f in sorted(glob.glob(os.path.join(W, "research_*.json"))):
        d = json.load(open(f)); d = d if isinstance(d, dict) else {"claims": d}
        for c in d.get("claims", []):
            txt = obter(c.get("source_url"))
            segs = segmentos(c.get("quote"))
            r = {"found": False, "how": "none", "have_text": bool(txt), "context": ""}
            if not segs:
                stats["no_quote"] += 1; r["how"] = "sem-trecho"; out[c["id"]] = r; continue
            if not txt:
                stats["no_text"] += 1; out[c["id"]] = r; continue
            key = id(txt)
            if key not in cache_norm: cache_norm[key] = (strict(txt), loose(txt))
            st, lo = cache_norm[key]
            if all(strict(s) in st for s in segs):
                r["found"], r["how"] = True, "literal"; stats["found_strict"] += 1
                i = st.find(strict(segs[0])); r["context"] = st[max(0, i - 300): i + len(strict(segs[0])) + 300]
            elif all(loose(s) in lo for s in segs):
                r["found"], r["how"] = True, "normalizado"; stats["found_loose"] += 1
                i = lo.find(loose(segs[0])); r["context"] = lo[max(0, i - 300): i + len(loose(segs[0])) + 300]
            else:
                stats["not_found"] += 1
                # melhor trecho parcial: maior segmento de 6 palavras encontrado
                ws = loose(segs[0]).split()
                for n in range(min(8, len(ws)), 3, -1):
                    hit = next((lo.find(" ".join(ws[k:k + n])) for k in range(0, len(ws) - n + 1) if lo.find(" ".join(ws[k:k + n])) >= 0), -1)
                    if hit >= 0:
                        r["context"] = "[parcial] " + lo[max(0, hit - 300): hit + 400]; break
            out[c["id"]] = r
    json.dump(out, open(os.path.join(W, "quotecheck.json"), "w"), ensure_ascii=False, indent=0)
    print(json.dumps(stats))


if __name__ == "__main__":
    main()

# Renderiza cada figura do glossário e aponta textos cortados pela viewBox e textos sobrepostos.
import sys, json
from playwright.sync_api import sync_playwright
S = sys.argv[1]
JS = r"""
() => {
  const out = [];
  const terms = VL.data.glossario.termos.filter(t => t.figura);
  const host = document.getElementById('g');
  for (const t of terms) {
    host.innerHTML = t.figura.svg;
    const svg = host.querySelector('svg');
    const vb = svg.viewBox.baseVal;
    const txt = [...svg.querySelectorAll('text')].filter(e => e.textContent.trim());
    const inv = svg.getScreenCTM().inverse();
    const boxes = txt.map(e => { const b = e.getBBox(), m = inv.multiply(e.getScreenCTM());
      const pts = [[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y]) => { const q = new DOMPoint(x,y).matrixTransform(m); return [q.x,q.y]; });
      const xs = pts.map(q=>q[0]), ys = pts.map(q=>q[1]);
      return {t: e.textContent, x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs)-Math.min(...xs), h: Math.max(...ys)-Math.min(...ys)}; });
    const clip = boxes.filter(b => b.x < vb.x - 0.5 || b.y < vb.y - 0.5 || b.x + b.w > vb.x + vb.width + 0.5 || b.y + b.h > vb.y + vb.height + 0.5).map(b => b.t);
    const ov = [];
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], c = boxes[j];
      const ix = Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x), iy = Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y);
      if (ix > 2 && iy > 3) ov.push(a.t + ' x ' + c.t);
    }
    if (clip.length || ov.length) out.push({id: t.id, clip, ov});
  }
  return out;
}
"""
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome", args=["--allow-file-access-from-files"])
    pg = b.new_page(viewport={"width": 900, "height": 700})
    pg.goto("file://" + S + "/figs.html")
    pg.wait_for_timeout(600)
    pg.evaluate("document.body.innerHTML='<div id=g style=\"width:600px\"></div>'")
    res = pg.evaluate(JS)
    for r in res: print(json.dumps(r, ensure_ascii=False))
    print('total com problema:', len(res))
    b.close()

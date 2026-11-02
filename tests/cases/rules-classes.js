// the Rules tab's classes, subclasses, and feats (made-up), and cards for a feat and a background: a long background
// goes onto more than one card rather than shrinking past reading
const q = s => document.querySelector(s);
const click = s => { const e = q(s); expect(e, "there's a " + s); e.click(); };
const typ = (s, v) => { const e = q(s); expect(e, "there's a " + s); e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); };
const pick = (s, v) => { const e = q(s); expect(e, "there's a " + s); e.value = v; e.dispatchEvent(new Event("change", { bubbles: true })); };
const cardCount = () => document.querySelectorAll("#cardov .cardbox img").length;

step("a feat, with a change to the sheet", () => {
  click('[data-tab="rules"]'); click('[data-act="rcat"][data-v="feats"]'); click('[data-act="new"]');
  typ('[data-f="name"]', "Test Knack"); pick('[data-f="type"]', "Origin"); typ('[data-f="text"]', "You're handy with tools and quick on your feet.");
  pick('[data-fxadd="fx"]', "skill"); pick('[data-fp="fx.0.k"]', "athletics"); click('[data-act="add"]');
  const x = db.feats[0]; return `${x.name}: ${lineOf("feats", x)}; fx ${JSON.stringify(x.fx)}`;
});
step("its card, and a long background's cards", async () => {
  ui.open = db.feats[0].id; render(); await showCard("feats", db.feats[0]); await wait(100); const one = cardCount(); q('[data-card="close"]').click();
  const long = Array.from({ length: 30 }, (_, i) => `Line ${i + 1} of a long made-up feature that keeps going for a while so that it can't all fit.`).join(" ");
  db.backgrounds.push({ id: "lbg_long", name: "Test Wanderer", skills: ["survival"], featureName: "Long Road", featureText: long });
  await showCard("backgrounds", db.backgrounds[0]); await wait(100); const two = cardCount(), names = cardNow.map(c => c.name).join(", "); q('[data-card="close"]').click();
  return `the feat: ${one} card; the long background: ${two} cards (${names})`;
});
step("a subclass and a class, with features by level", () => {
  ui.tab = "rules"; ui.open = null; ui.draft = null; render(); click('[data-act="rcat"][data-v="subclasses"]'); click('[data-act="new"]'); typ('[data-f="name"]', "Test Path"); pick('[data-f="of"]', "Fighter");
  click('[data-act="fpadd"][data-p="features"]'); typ('[data-fp="features.0.level"]', "3"); typ('[data-fp="features.0.name"]', "Test Surge"); pick('[data-fxadd="features.0.fx"]', "res"); typ('[data-fp="features.0.fx.0.name"]', "Test Surge");
  click('[data-act="add"]');
  click('[data-act="rcat"][data-v="classes"]'); click('[data-act="new"]'); typ('[data-f="name"]', "Test Warden"); pick('[data-f="caster"]', "half");
  click('[data-act="fpadd"][data-p="cols"]'); typ('[data-fp="cols.0.name"]', "Wards"); typ('[data-fp="cols.0.vals.0"]', "2");
  q('[data-fp="cols.0.use"]').checked = true; q('[data-fp="cols.0.use"]').dispatchEvent(new Event("change", { bubbles: true }));
  click('[data-act="fpadd"][data-p="features"]'); typ('[data-fp="features.0.name"]', "Warding Step"); click('[data-act="add"]');
  const s = db.subclasses[0], c = db.classes[0];
  return `${s.name} (${lineOf("subclasses", s)}): ${JSON.stringify(s.features)} | ${c.name} (${lineOf("classes", c)}): cols ${JSON.stringify(c.cols.map(k => ({ name: k.name, first: k.vals[0], use: k.use })))}`;
});
step("Sync carries them; the Rules tab counts them", () => `Sync: ${SYNC_CATS.join(", ")}; Rules tab: ${q('[data-tab="rules"]').textContent.replace(/\s+/g, " ").trim()}`);

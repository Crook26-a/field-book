// the Rules tab's species and races (made-up): the form, a race's card, and an entry the Character Book moves here
// taken in while the Field Book is open
const q = s => document.querySelector(s);
const click = s => { const e = q(s); expect(e, "there's a " + s); e.click(); };
const typ = (s, v) => { const e = q(s); expect(e, "there's a " + s); e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); };
const pick = (s, v) => { const e = q(s); expect(e, "there's a " + s); e.value = v; e.dispatchEvent(new Event("change", { bubbles: true })); };

step("a race, made with the form: a subrace, an increase, a trait with a change", () => {
  click('[data-tab="rules"]'); click('[data-act="rcat"][data-v="races"]'); click('[data-act="new"]');
  typ('[data-f="name"]', "Test Glade Gnome"); pick('[data-f="of"]', "Gnome"); typ('[data-fp="bonus.dex"]', "1"); typ('[data-f="languages"]', "Sylvan");
  click('[data-act="fpadd"][data-p="features"]'); typ('[data-fp="features.0.name"]', "Test Leafstep"); typ('[data-fp="features.0.text"]', "You move quietly through leaves."); pick('[data-fxadd="features.0.fx"]', "speed");
  click('[data-act="add"]'); const x = db.races[0];
  return `${x.name}: ${lineOf("races", x)} | ${JSON.stringify({ of: x.of, size: x.size, speed: x.speed, bonus: x.bonus, languages: x.languages, features: x.features })}`;
});
step("its card", async () => {
  ui.open = db.races[0].id; render(); await showCard("races", db.races[0]); await wait(100);
  const n = document.querySelectorAll("#cardov .cardbox img").length, names = cardNow.map(c => c.name).join(", "); q('[data-card="close"]').click();
  const [, y] = ruleCards("races", db.races[0])[0];
  return `${n} card (${names}): ${y.kind} | ${y.desc.replace(/\n/g, " / ")}`;
});
step("one the Character Book moves here comes in while it's open", () => {
  save(true); const o = JSON.parse(localStorage.getItem(STORE) || "{}");
  o.feats = [...(o.feats || []), { id: "ft_cb1", name: "Test Moved Feat", type: "General", text: "Moved.", fx: [], fbEdited: Date.now() }];
  const v = JSON.stringify(o); localStorage.setItem(STORE, v); window.dispatchEvent(new StorageEvent("storage", { key: STORE, newValue: v })); ui.open = null; render();
  return `feats: ${db.feats.map(x => x.name).join(", ")}; races kept: ${db.races.map(x => x.name).join(", ")}; Sync: ${SYNC_CATS.join(", ")}; Rules tab: ${q('[data-tab="rules"]').textContent.replace(/\s+/g, " ").trim()}`;
});

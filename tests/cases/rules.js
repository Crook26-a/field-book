// the Rules tab: a background and a roll table made here, kept apart from what's sent to the survey, and in Sync's file
const q = s => document.querySelector(s);
const click = s => { const e = q(s); expect(e, "there's a " + s); e.click(); };
const typ = (s, v) => { const e = q(s); expect(e, "there's a " + s); e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); };
const tick = s => { const e = q(s); expect(e, "there's a " + s); e.checked = true; e.dispatchEvent(new Event("change", { bubbles: true })); };

step("a background on the Rules tab", () => {
  click('[data-tab="rules"]'); click('[data-act="new"]');
  typ('[data-f="name"]', "Dockhand"); tick('[data-multi="skills"][data-v="athletics"]'); tick('[data-multi="skills"][data-v="insight"]');
  typ('[data-f="featureName"]', "Harbor Friends"); click('[data-act="add"]');
  const x = db.backgrounds[0]; expect(x && x.name === "Dockhand", "kept");
  return `${x.name}: ${JSON.stringify(x.skills)}; list says ${q("#view").textContent.replace(/\s+/g, " ").match(/Dockhand[^R]*/)[0].trim()}`;
});
step("a roll table: what it reads, and a roll", () => {
  click('[data-act="rcat"][data-v="tables"]'); click('[data-act="new"]');
  typ('[data-f="name"]', "Harbor rumors"); typ('[data-f="text"]', "1 | A ship is late.\n2 | The lighthouse keeper is gone.\n4 | Fish are dying.");
  const note = q("#tblSum").textContent; click('[data-act="tblroll"]'); const rolled = q("#tblTry").textContent; click('[data-act="add"]');
  return `${note} | ${rolled}`;
});
step("not sent to the survey, but in Sync's file", () => {
  expect(toSend() === 0, "nothing for the survey", toSend());
  return `Sync carries: ${SYNC_CATS.join(", ")}; tabs: ${[...document.querySelectorAll("#tabs .tab")].map(b => b.textContent.replace(/\s+/g, " ").trim()).join(" | ")}`;
});

// the Rules tab: a background and a roll table made here, kept apart from what's sent to the survey, and in Sync's file
const q = s => document.querySelector(s);
const click = s => { const e = q(s); expect(e, "there's a " + s); e.click(); };
const typ = (s, v) => { const e = q(s); expect(e, "there's a " + s); e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); };
const tick = s => { const e = q(s); expect(e, "there's a " + s); e.checked = true; e.dispatchEvent(new Event("change", { bubbles: true })); };

step("a background on the Rules tab", () => {
  click('[data-tab="rules"]'); click('[data-act="new"]');
  typ('[data-f="name"]', "Dockhand"); tick('[data-multi="skills"][data-v="athletics"]'); tick('[data-multi="skills"][data-v="insight"]');
  // the feature from the dropdown shows what it does; the feat too
  const pick = (k, v) => { const e = q(`[data-bgsel="${k}"]`); expect(e, "a " + k + " dropdown"); e.value = v; e.dispatchEvent(new Event("change", { bubbles: true })); };
  pick("feature", "Shelter of the Faithful"); const said = q("#view .panel .note").textContent.slice(0, 70);
  pick("feat", "Skilled"); click('[data-act="add"]');
  const x = db.backgrounds[0]; expect(x && x.name === "Dockhand", "kept");
  return `feature says: ${said} | ${x.name}: ${JSON.stringify(x.skills)}, ${x.feat}, ${x.featureName}; list says ${q("#view").textContent.replace(/\s+/g, " ").match(/Dockhand[^R]*/)[0].trim()}`;
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

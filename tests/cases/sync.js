// Sync, against a pretend GitHub in the page (the gist lives in __KIT.keep, so a restart at a step has it): the first
// sync sends an item up; "the other device" (an edit to the gist) changes it and adds a person; a deletion travels.
const fakeGitHub = () => {
  window.fetch = async (url, o = {}) => {
    const k = __KIT.keep, u = String(url), ok = b => ({ ok: true, status: 200, json: async () => JSON.parse(JSON.stringify(b)) });
    if (/\/gists\?/.test(u)) return ok(k.gist ? [{ id: k.gist.id, description: k.gist.description }] : []);
    if (/\/gists$/.test(u) && o.method === "POST") { const b = JSON.parse(o.body); k.gist = { id: "g1", description: b.description, files: b.files }; return ok(k.gist); }
    if (/\/gists\/g1$/.test(u) && o.method === "PATCH") { Object.assign(k.gist.files, JSON.parse(o.body).files); return ok(k.gist); }
    if (/\/gists\/g1$/.test(u)) return ok(k.gist);
    return { ok: false, status: 404, json: async () => ({}) };
  };
};
const cloud = () => JSON.parse(__KIT.keep.gist.files["field-book-sync.json"].content);
const otherDevice = fn => { const c = cloud(); fn(c); __KIT.keep.gist.files["field-book-sync.json"].content = JSON.stringify(c); };

step("an item, set up, and the first Sync sends it", async () => {
  fakeGitHub(); db.loot.push({ id: "ll_test", name: "Silver bell", kind: "curio", fbMade: Date.now(), fbEdited: Date.now() }); save(true);
  setSyncCfg({ token: "test" }); await doSync(); await wait(50);
  expect(cloud().entries.loot.some(x => x.id === "ll_test"), "the bell is in the cloud");
  return `cloud: ${cloud().entries.loot.map(x => x.name).join(", ")}`;
});
step("the other device renamed the bell and wrote a person: Sync brings both", async () => {
  fakeGitHub();
  otherDevice(c => { const b = c.entries.loot.find(x => x.id === "ll_test"); b.name = "Cracked silver bell"; b.fbEdited = Date.now() + 1000;
    c.entries.npcs.push({ id: "ln_test", name: "Old Marta", fbMade: Date.now() + 1000, fbEdited: Date.now() + 1000 }); c.campaigns = ["Kalatecha"]; });
  await doSync(); await wait(50);
  expect(db.loot.find(x => x.id === "ll_test").name === "Cracked silver bell" && db.npcs.some(x => x.id === "ln_test"), "renamed bell and Old Marta here");
  return `here: ${db.loot.map(x => x.name).join(", ")}; ${db.npcs.map(x => x.name).join(", ")}; campaigns ${db.campaigns.join(", ")}`;
});
step("this device deletes the bell: Sync carries it", async () => {
  fakeGitHub(); ui.tab = "loot"; ui.open = "ll_test"; render();
  const del = document.querySelector('[data-act="del"]'); expect(del, "the Delete button"); del.click(); await doSync(); await wait(50);
  const c = cloud(); expect(!c.entries.loot.some(x => x.id === "ll_test") && !!c.deleted.ll_test, "gone from the cloud, marked deleted");
  return `cloud items: ${c.entries.loot.length}; deleted: ${Object.keys(c.deleted).join(", ")}`;
});

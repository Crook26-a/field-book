// A person's quirk on the phone (Joseph, 2026-11-04: "Put it on the field book"): rolled with the whole person, its own
// box and dice, from the survey's quirk lists (a sea one for the nautical theme).
const qq = s => document.querySelector(s);
step("a new person: roll someone, then roll just the quirk", () => {
  ui.tab = "npcs"; ui.open = null; render(); qq('[data-act="new"]').click();
  ui.theme = "nautical"; ui.kind = "bosun"; qq('[data-roll="whole"]').click();
  const x = entry(), first = x.quirk, box = !!qq('[data-f="quirk"]');
  qq('[data-roll="quirk"]').click(); const again = entry().quirk;
  expect(box && first && again, "a Quirk box, rolled both ways", { box, first, again });
  return `${x.name} (${x.role}) | quirk: ${first} | rolled again: ${again} | box shown: ${box}`;
});

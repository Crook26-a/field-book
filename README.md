# Field Book

A pocket notebook for **Ordinate Survey**. Write up items and people on your phone, away from the table, then send them to the survey.

- **Items:** kind, rarity (with the 2024 rules' price guide), value, weight, description, attunement, damage, Armor Class, charges, and how it's used: the action it takes, charges per use, when charges come back (at dawn or after a rest), healing, temporary hit points, and a condition it puts on.
- **People:** name, role, where they are, alignment, look, voice, wants, what they know or hide, and backstory, with a roll for each (the survey's own tables), or roll a whole person. Also "a spare: nobody yet", what they fight as, a character sheet, a purse, and what they carry.
- **Send:** shares a `field-book-….json` file (or copies it as text). In Ordinate Survey: **Library → Field Book: bring in…**. Sending the same entry again updates it there.
- **Bring a file in:** from another phone, a backup, or the survey's own **Library → Send to the Field Book**.

Everything stays on the phone until you send it. Add it to your home screen and it works offline.

Files: `index.html` (the whole app), `sw.js` (offline cache; bump `CACHE` with each release), `manifest.webmanifest`, and the icons.

**Sync:** the Sync button (top right) keeps the Field Book the same on every device: items, people, spells, shop kinds, factions, and the campaigns it knows, entry by entry, the newer copy winning; deletions travel too. It shares the Character Book's setup (same token, same secret gist, its own file there), so set Sync up once in the Character Book and it works here as well. Theme, the roller, and the campaign filter stay on each device.

Tests: `powershell -NoProfile -ExecutionPolicy Bypass -File tests\run.ps1` (the same step-test runner as the Character Book's).

## Rules tab (v30)

Backgrounds, roll tables, classes, subclasses, and feats for the players (classes, subclasses, and feats since v32, with their features by level and their changes to a character's sheet, the Character Book's way): made here, synced to the Character Book (its builder and level-up offer them; every character can roll the tables). Feats and backgrounds have cards for the players too, drawn as item cards are; a long one goes onto numbered cards rather than shrinking past reading. They aren't sent to the survey, and their notes stay on this phone.

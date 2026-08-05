# The Gentlemen — Threat Actor Profile

A static, single-page threat intelligence report on **The Gentlemen** ransomware group, built as a portfolio piece for CTI / dark web intelligence analyst roles. Pure HTML/CSS/JS — no build step, no dependencies beyond Google Fonts.

## Before you publish: personalize it

This is a starting point, not a finished product to upload as-is. At minimum, do these three things:

1. **Write the Analyst Notes section yourself.** Open `index.html`, search for `id="analyst-notes"`, and replace the placeholder text and empty `<textarea>` prompts with your own written assessment. This is the single highest-value section for a hiring manager — it's the part that proves you can do original analysis, not just aggregate other people's reports. Don't ship this with the placeholder still in it.
2. **Update the footer.** Search for `[Your Name]` and the `#` placeholder links for LinkedIn/GitHub and fill in your real details.
3. **Re-verify the facts against current sources before publishing.** This was built from open reporting as of early August 2026. Ransomware groups evolve fast — check the Sources section links are still live and that victim counts / CVEs haven't been updated by the vendors since.

Optional but recommended:
- Add your own screenshot/annotation of a MITRE ATT&CK Navigator layer built from the technique table (a `.json` layer file dropped into the ATT&CK Navigator and screenshotted is a strong, easy addition that shows tool fluency).
- Consider trimming or expanding sections to match the specific job description you're applying to (e.g., emphasize victimology/geopolitical framing more for a strategic-intel role, emphasize IOCs/detection engineering more for a SOC-adjacent CTI role).

## Deploying to GitHub Pages

1. Create a new GitHub repository (e.g. `gentlemen-threat-profile`).
2. Add these three files to the repo root: `index.html`, `styles.css`, `script.js`. (Also fine to include this `README.md`.)
3. Commit and push to the `main` branch.
4. In the repo, go to **Settings → Pages**.
5. Under **Build and deployment → Source**, select **Deploy from a branch**.
6. Under **Branch**, select `main` and folder `/ (root)`, then **Save**.
7. Wait 1–2 minutes. Your site will be live at:
   `https://<your-github-username>.github.io/<repo-name>/`

No `package.json`, no build action, no framework — GitHub Pages serves the static files directly, so there's nothing else to configure.

## File structure

```
index.html    — all report content and structure
styles.css    — design system (dossier/case-file visual identity)
script.js     — scroll-based nav highlighting, gauge/stat animations
README.md     — this file
```

## Local preview

Any static file server works, e.g. from this folder:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser.

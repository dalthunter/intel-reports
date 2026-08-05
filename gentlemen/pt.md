# Reusable prompt: build a CTI portfolio report on any threat actor

Copy the block below into a new Claude conversation and fill in the bracketed fields. Built from the process used to generate The Gentlemen report — reuse it for your next actor (a different ransomware group, an APT, or a dark-web marketplace/access-broker ecosystem for a "dark web intelligence" angle).

---

```
I'm building a portfolio piece to get hired as a [cyber threat intelligence analyst /
dark web intelligence analyst] at companies like [Recorded Future / CrowdStrike /
Intel 471 / Mandiant]. I want you to research and build a full threat intelligence
report on [THREAT ACTOR NAME], packaged as a static website.

Research requirements:
- Search for current, recent reporting (last 3-6 months if possible) from primary
  vendor sources (Group-IB, Mandiant, CrowdStrike, Trend Micro, Cybereason, Huntress,
  Check Point, Recorded Future, etc.) and reputable trade press.
- Pull real, current data: first-seen date, victim counts, sectors/geography targeted,
  CVEs exploited, malware/tooling used, and MITRE ATT&CK technique IDs with confidence
  levels where the source states them.
- Cite every specific claim back to its source with a clickable link.
- Do not fabricate statistics, hashes, or CVEs — if a data point isn't in your search
  results, leave it out or flag it as unconfirmed rather than inventing it.

Content structure (standard CTI report sections):
1. Executive summary / hero (actor name, aliases, one-line thesis, key stats)
2. Key judgments (IC-style, each with a stated confidence level: high/moderate/low)
3. Actor profile (origin, structure, motivation, business model if RaaS)
4. Timeline of activity
5. Victimology (sectors, geography — call out anything statistically notable)
6. Kill chain / TTPs mapped to MITRE ATT&CK (tactic, technique ID, technique name,
   procedure description, confidence)
7. Technical deep dive (CVEs exploited with patch status, tooling/malware used)
8. IOCs (file hashes, infrastructure indicators — for detection engineering, not
   for reproducing functional exploit code or credential lists)
9. Detection & mitigation priorities, ranked by impact-to-effort
10. Analyst notes — leave this as an editable placeholder for MY OWN written
    assessment, not yours. Include 2-3 prompting questions for what I should
    cover here.
11. Sources list with clickable links

Guardrails:
- Do not include working attack scripts, functional exploit code, or
  copy-paste-ready credential lists, even if a source report includes them —
  summarize the technique instead. This should read as a defensive intelligence
  product, not a how-to.
- Add a couple of short "in plain terms" callout boxes explaining jargon (e.g.
  RaaS, BYOVD, double extortion) for a reader who's new to CTI — I want this
  report to double as something I could walk a junior analyst through.
- Keep my own voice space clearly marked and separate from your synthesis, so
  it's obvious what I personally contributed versus what's aggregated research.

Design & technical requirements:
- Build as a static HTML/CSS/JS site — no framework, no build step, no external
  APIs — so it deploys cleanly on GitHub Pages with zero configuration. Do not
  use anything that depends on Vercel/Netlify-specific config (no serverless
  functions, no vercel.json, no netlify.toml).
- Give me a distinctive, intentional visual design appropriate to a CTI/dossier
  context — not a generic template look. Use the frontend-design skill if
  available to plan a real design system (palette, type pairing, layout
  concept, one signature element) before writing code.
- Fully responsive down to mobile, visible keyboard focus states, and respect
  prefers-reduced-motion.
- Give me the full downloadable code plus a README with exact GitHub Pages
  deployment steps (Settings → Pages → branch → folder).

Deliverables:
1. The full site (index.html, styles.css, script.js)
2. A README.md with deployment instructions
3. A short list, outside the site, of what I should personally verify or
   customize before I publish this under my own name
```

---

## Notes on using this well

- **Swap the actor deliberately.** A ransomware group is the safest, most-documented choice. If you want to stand out for a "dark web intelligence" role specifically, consider an access-broker or a specific dark-web marketplace instead of another ransomware brand — it signals you understand the ecosystem beyond leak sites.
- **Always do the Analyst Notes section yourself, by hand, after Claude generates the report.** That section is what separates a portfolio piece from a book report. Don't ask Claude to write it for you — it can suggest what to cover, but the actual judgment calls need to be yours, because that's what an interviewer is actually evaluating.
- **Re-run the research close to your interview date.** Threat actor activity changes fast; a report that's six months stale reads worse than no report at all in this field.

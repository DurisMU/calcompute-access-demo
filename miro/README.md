# Miro assets

Use these in the Miro board:

- `01-home.png` — landing page with the popup.
- `02-home-no-popup.png` — directory without the popup.
- `03-survey.png` — survey form.
- `04-result-matrix.png` — result page with the Equity Access Matrix.

Recommended Miro frame:

1. Title: **CalCompute Access Survey — Live Demo**
2. Add a link/button to the GitHub Pages URL.
3. Add a QR code to the same URL.
4. Place the four screenshots in order: popup → survey → result.
5. Add one line: “Research prototype. No live CalCompute service. Not a final eligibility decision.”

Demo URLs:

- Home: `/`
- Survey: `/survey/`
- Survey form (skip intro): `/survey/?start=1`
- Result preview: `/survey/?demo=result`

## Embed mode

Use this URL inside a Miro Embed / Web page card:

```text
https://durismu.github.io/calcompute-access-demo/?embed=1
```

It hides the site header, footer, and floating button, and opens the popup automatically.
Recommended embed size: 900 × 650 or 1000 × 750.

If Miro asks for HTML:

```html
<iframe src="https://durismu.github.io/calcompute-access-demo/?embed=1"
        width="100%" height="650"
        style="border:0;border-radius:16px;"
        allow="clipboard-write"></iframe>
```

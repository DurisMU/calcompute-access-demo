# CalCompute Access Lab — research prototype

A static GitHub Pages prototype for the CalCompute user-experience and access workstream.

It includes:

- A mock resource directory.
- A popup: **“Didn't find a resource that fits your needs?”**
- A 2-minute survey with 12 scored questions and 5 context questions.
- An equity-centered access matrix with a colorful, animated visualization.
- A preliminary result: Priority review, Eligible with support, or Signpost.
- A JSON download of the result. No backend, no personal data required.

> This is early student research. There is no live CalCompute service and no final eligibility decision.

## Run locally

```bash
cd calcompute-access-demo
python3 -m http.server 8000
```

Open:

- http://localhost:8000/
- http://localhost:8000/survey/

## Deploy to GitHub Pages

1. Create a new repository, for example `calcompute-access-demo`.
2. Push this folder to `main`.
3. In GitHub: **Settings → Pages → Build and deployment**.
4. Source: **Deploy from a branch**.
5. Branch: `main`; folder: `/ (root)`.
6. Save. GitHub gives you a URL such as:

```text
https://<your-username>.github.io/calcompute-access-demo/
```

The survey is at:

```text
https://<your-username>.github.io/calcompute-access-demo/survey/
```

## Add it to Miro

Recommended: add a Miro card or frame with:

- A QR code to the GitHub Pages URL.
- A button/link: “Open live demo”.
- Three screenshots: popup, survey, result matrix.

Optional: embed the GitHub Pages URL in Miro with the “Embed” or “Web page” card. Some Miro plans or browsers may block iframes; the link/QR route always works.

## Scoring

```text
Access need      = q1 + q2 + q3          (0–15)
Information need = q7 + q8 + q9          (0–15)
Support need     = q4 + q5 + q6          (0–15)
Public benefit   = q10 + q11 + q12       (0–15)

Need score     = Access need + Information need    (0–30)
Priority score = Need score + Public benefit       (0–45)
```

Result bands:

| Priority score | Result |
|---|---|
| 32–45 | Priority review |
| 18–31 | Eligible with support |
| 0–17 | Signpost |

If `Support need >= 9`, the result adds a support flag: training or technical help may be needed. That is an onboarding need, not a disqualification.

## Files

```text
index.html                 mock directory + popup
survey/index.html          survey + result page
assets/styles.css          design system
assets/popup.js            popup behavior
assets/survey.js           questions, scoring, result
assets/matrix.js           SVG equity access matrix
```

## Notes

- No backend. Results stay in the browser.
- No analytics, cookies, or external data collection.
- `Download my result (JSON)` lets a tester save a response for research notes.
- If you later need real responses, connect the form to a Google Apps Script endpoint or another form service.
- Do not describe this as a live CalCompute service. Use “early student research prototype”.

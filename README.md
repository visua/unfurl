# Unfurl

Paste a URL, see its Open Graph card the way Facebook, X, LinkedIn, WhatsApp, Discord, Slack and iOS Messages render it, edit the copy in place, and export each card as SVG for Figma.

- `public/index.html` is the whole app. No build step.
- `netlify/functions/unfurl.mts` fetches a page server-side, reads its `og:` tags and returns the image as a data URI, so previews and exports are self-contained.

## Run locally

```
npm install
npx netlify dev
```

## Deploy

Import this repo in Netlify. The `netlify.toml` already points at `public/` and the function.

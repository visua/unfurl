# Log

## 2026-09-17

- URL field accepts bare domains (e.g. `trumprx.gov`): plain text input with a URL keyboard instead of `type=url`, which made the browser reject anything without a scheme. The function already adds `https://`.
- Phone touch fixes: pinch and double-tap zoom disabled, URL field 16px on touch devices so iOS does not zoom on focus, no long-press callouts or tap flash on the cards.
- Removed the edge fade overlays entirely; side cards now run straight off the viewport.
- Dot icons no longer lift on hover; hover and active are color-only.
- URL field moved to the top of the page (absolute, centered, 24px from the top); the error message moved down so it cannot overlap it.

- Previews now live in a looping, center-aligned carousel built on Embla Carousel 8.6 (MIT) with the wheel-gestures plugin, replacing the single-card stage and icon dock. Cards render at native size with a gap that scales with the viewport; 45px edge fades at 50% opacity.
- Dot row under the cards uses the platform icons on transparent circles, active icon in ink. Dots travel linearly (a dot to the left animates backward) instead of taking the loop's shortest path, which felt wrong.
- Spring feel tuned via Embla `duration: 40` (Flickity-equivalent attraction); mouse drag, trackpad swipe, mouse wheel, arrow keys and side-card clicks all animate to a card.
- Inline text editing and image replace work inside the carousel; all seven cards re-render on each keystroke from a `blob:` URL of the image while exports keep the self-contained data URI (about 6ms per keystroke with an 825KB image).
- Default import is now https://www.apple.com/ipad-pro/ unless `?url=` is given.
- Added `.claude/launch.json` for the dev server, `tasks/` notes, and committed `package-lock.json`; `deno.lock` (Netlify CLI artifact) is ignored.

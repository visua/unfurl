# Carousel redesign (Figma node 2308-12152)

- [x] Replace icon dock with dot row (39px, 9px gap, active black + shadow)
- [x] Render all seven previews into a horizontal snap carousel, active card centered
- [x] Edge fades (bg → transparent) on both sides
- [x] Mouse drag with momentum → snap to nearest card; touch/trackpad stay native
- [x] Dots, arrow keys, and clicking a side card all center that card
- [x] Inline editing and image replace keep working inside the carousel
- [x] Infinite loop (added mid-task): 3 clone cards each side, silent jump to the real twin at rest
- [x] Verify in browser: drag, wheel, dots, keyboard, edit, export, phone width

## Review

- Native `overflow-x` + `scroll-snap` does the scrolling; JS only adds mouse drag, dots, keys and the loop jump.
- Looping: cards = [last 3 clones] + [7 real] + [first 3 clones]. Any rest on a clone → instant `scrollTo` by the offset between clone and twin.
- Settle detection is a 150ms debounce on `scroll` events (works for trackpad, touch, smooth scrollTo and drag release; no `scrollend` dependency).
- `restIdx` (the card we mean to be on) is separate from `curIdx` (nearest right now) so resizes and hide/show can't drift the carousel. Zero-width rail is ignored entirely.
- Perf: on-screen cards embed a `blob:` URL for the image; exports embed the data URI. Keystroke re-render of 13 cards dropped from ~40ms to ~6ms with an 825KB image.
- Flick momentum is capped at one card past the release point so a hard flick never overshoots.
- Not committed. `.claude/launch.json` (dev server launch config) is also untracked.
- Follow-ups from review: platform icons restored inside the dots (Font Awesome, as the old dock used); circles transparent, active icon in ink, inactive light grey.
- `history.scrollRestoration = 'manual'`: Chrome restores the rail's scroll offset on reload after the first layout, which reopened the page on a random card.

## Round 2 (Embla)
- [x] Replaced the hand-rolled native-scroll carousel with Embla Carousel 8.6 (MIT) + wheel-gestures plugin: transform-based physics, `loop: true`, `align: 'center'`.
- [x] Dots travel linearly (left dot = backward) via `internalEngine().scrollTo.index(i, dir)`; Embla's `dir` is the translation sign, so forward is -1.
- [x] Slide spacing uses Embla's pattern (padding-left on slides, negative margin-left on container); CSS `gap` breaks loop width and centering.
- [x] Embla is mounted after the first render so it measures real widths; custom `watchResize` must call `reInit()` itself (return value is ignored) and only does so on width changes.
- [x] Default import: https://www.apple.com/ipad-pro/ (or `?url=`).
- [x] Fades: 45px wide, 50% opacity. Icons back in the dots; circles transparent, active icon in ink.

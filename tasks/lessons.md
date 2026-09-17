# Lessons

- **Don't hand-roll carousel physics when the brief is "native, polished, smooth".** Native scroll-snap plus smooth `scrollTo` stutters in Chrome and drag/loop/wrap logic balloons. Reach for Embla (MIT) first; Flickity is GPL/commercial.
- **"Shortest way round" is not what people expect from a row of dots.** A dot left of the active one must animate backward even if the loop makes forward shorter.
- **The browser pane is shared with the user.** Unexplained state changes during a wait were the user dragging and pressing keys live. Log real pointer/key events before assuming a bug, and keep automated checks short.
- **Long injected scripts throttle rAF in the pane**, so mid-animation readings taken inside one `javascript_tool` call are unreliable. Use `computer` actions with waits, then a short read.
- **Read the library's contract, not its type signature.** Embla's custom `watchResize` ignores the return value; you must call `reInit()` yourself.
- **When a design shows dots, ask whether they are placeholders.** The Figma frame had plain circles; the user wanted the platform icons inside them.

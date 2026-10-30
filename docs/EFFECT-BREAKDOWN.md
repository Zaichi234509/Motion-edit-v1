# Teardown — the "code-based motion graphics" reel, and how to rebuild it as a website

Source file analysed: `AQNRq2OK…Axlg.mp4` (Google Drive, `1fF9q-Cp9sNDEEky54Vkr8SHqi7uq4HwE`)

| Property | Value |
| --- | --- |
| Container | MP4 / ISO base media, H.264 High + AAC HE |
| Frame | 720 × 1280 (9:16, square pixels) |
| Duration | 95.40 s |
| Frame rate | 30 fps |
| Bitrate | ~841 kb/s video, ~48 kb/s audio |
| Structure | Hook strip → motion-graphics body → real UI → talking-head outro |

---

## 1. What is actually on screen

The reel is **three visual modes stitched together**, not one continuous animation:

1. **The hook strip (0–8 s).** A flat amber/gold gradient occupies the top ~30 % of the
   frame with one line of white display type — `New Claude opus 5.5 🤯`. It stays pinned for
   almost the whole video. This is a retention device: the same "headline" is always visible
   while the body of the frame changes underneath.

2. **The neon canvas (8–85 s).** A deep-violet gradient with a hairline grid, heavy vignette,
   faint scanlines, and a QuickTime-style title bar sitting on top of it. Everything that
   moves — headlines, diagrams, screenshots, cursors — happens *inside* this canvas. Below it:
   a macOS dock row of app icons and a blurred keyboard, which turns the whole frame into a
   "laptop filmed from above" shot without ever showing a real laptop.

3. **The real-world outro (85–95 s).** Cut to a person in a neon-lit room, huge lime
   outline type over them (`Comment "KATANA"`), then a phone-shaped CTA card.

Everything in mode 2 is deterministic graphic design. **There is no footage in it at all** —
which is exactly why it can be rebuilt as HTML/CSS and driven by data.

## 2. The six primitives

Every beat in the 95 s is one of these, re-applied to new copy.

| # | Primitive | What it looks like | Implementation |
| --- | --- | --- | --- |
| 1 | **Amber hook bar** | Flat warm gradient, one white line, pinned | `background: radial-gradient(...)` + `flex: 0 0 30%` |
| 2 | **Neon grid canvas** | 34 px grid, radial mask, vignette, scanlines | three stacked absolutely-positioned divs |
| 3 | **Bloom headline** | White weight-900 type that appears to emit light | 5-stop `text-shadow` ladder + blurred duplicate `::before` |
| 4 | **Slam-in** | Headline punches in from 1.28× and 10 px blur | `@keyframes` with `cubic-bezier(.7,0,.2,1)` |
| 5 | **Self-drawing diagram** | Framed boxes + curved connectors that stroke on | SVG Bézier + `stroke-dashoffset` animation + `feGaussianBlur` merge |
| 6 | **Sparkle burst** | 4-point stars popping around a landing element | 8-point `clip-path` polygon on a radial gradient |

Two supporting moves do most of the "expensive" feeling:

- **Camera push** — a 1.06 → 1.00 scale on the whole scene across its duration. One transform,
  removes all dead air.
- **Word-by-word type-on** — the sublines appear one word at a time, blur → sharp, 55 ms apart.
  It reads as typing without a caret.

## 3. Timing map

```
0:00 ─ hook bar + first headline bloom
0:08 ─ headline lands top-left, mono micro-label, screenshot flies in
0:27 ─ diagram: 3 framed boxes, connectors draw on, sparkle at the destination
0:45 ─ brand beat: logo + wordmark letter-stagger, nothing else moves
1:05 ─ product UI as evidence: rounded screenshots, fake cursor
1:25 ─ outro: talking head, outline type, comment CTA
```

Scene lengths: **3.0–3.4 s**. That is the number to copy. Shorter and the copy is unreadable;
longer and short-form viewers scroll.

Stagger values that make it feel designed:

| Element | Stagger |
| --- | --- |
| Words in a subline | 55 ms |
| Diagram nodes | 160 ms |
| Sparkles | 150 ms |
| Connectors | 250 ms |

## 4. How to build the *website*

There are three viable architectures. Pick by what you need to change later.

### A. DOM + CSS (what `site/` implements) — recommended

Every beat is a `<div>`. The stage is a 9:16 flex column of five layers. Scenes are a JSON-ish
array; React swaps them on a timer and CSS keyframes do the motion.

- **Pros:** copy-paste-able snippets, trivially editable, text stays real text (selectable,
  translatable, accessible), tiny bundle, no GPU shader work, and re-rendering after a copy
  change is instant.
- **Cons:** no genuine 3D, no per-pixel distortion. For the reference reel you don't need either
  — its "3D blob" beat is the only genuinely WebGL-ish moment.

### B. Canvas 2D / WebGL

Right choice only if you want the swirling 3D blob behind the wordmark, real particle fields,
or shader distortion. Use `three.js` for the object and keep the *typography* in DOM on top —
hybrid is what the reference effectively is.

### C. Video composition (Remotion)

If the deliverable is literally an MP4 per script, compose in Remotion: same React components,
but rendered by a headless Chromium into frames. Slower to iterate, perfect for batch output.

### File map of the rebuild

```
site/
├─ index.html                 fonts + mount point
├─ vite.config.ts             dev server (allowedHosts for preview)
└─ src/
   ├─ scenes.ts               ← THE CONTENT. edit strings here
   ├─ stage.tsx               device chrome, canvas, headline, diagram, sparkles
   ├─ scene-player.tsx        timer + progress + scene chips
   ├─ app.tsx                 page: teardown, effect library, playground, recipe
   └─ styles.css              the entire design system (tokens → primitives)
```

The important architectural line: **`scenes.ts` is content, everything else is renderer.**
That is what makes it a website rather than a video.

## 5. Mapping *your* content to the same effect

The reel's look survives because the primitives are chosen by *rhetorical job*, not by taste.
Use this table:

| You want to say… | Use | Why it reads |
| --- | --- | --- |
| "this is new / look here" | hook bar + slam headline | motion energy at the top of the frame grabs the thumb-stop |
| "here's the problem" | headline top-left + mono label + one-line sub | calm, left-aligned, reads like a slide of evidence |
| "here's the mechanism" | framed node diagram + self-drawing connector | the line *arriving* is the explanation |
| "here's proof" | real screenshot inset, rounded, fake cursor | screenshots are credibility; animation around them is honesty |
| "remember this word" | logo beat, letter stagger, sparkle burst | the only moving thing in frame is the word |
| "do this now" | outline type + CTA card | outline type over a dark plate is the highest-contrast CTA |
| Long text / list | **don't** use this style — cut to 4–7 words per beat | the system has no room for paragraphs |

Concrete swaps for common content types:

- **Product launch** → hook bar = the release claim; nodes = `you → model → output`;
  proof beat = the actual UI; CTA = the product name in lime.
- **Tutorial / explainer** → drop the hook bar, keep the canvas full-bleed, make every beat a
  diagram, use the type-on subline for the voiceover transcript.
- **Case study / agency reel** → keep camera push and node diagrams, replace sparkles with a
  logo lockup, use the real client screenshots as the proof beat.
- **Music / event promo** → beat-match the `ms` values to the track (120 BPM → 3.0 s per scene
  = 6 beats), swap sparkles for the artist name ignition.

## 6. Exporting it back to video

Because every beat is deterministic CSS, capture is trivial and frame-accurate:

```bash
# option 1 — screen record the live preview at 60 fps
# option 2 — headless capture, then stitch
ffmpeg -framerate 60 -i frame_%04d.png -c:v libx264 -pix_fmt yuv420p -crf 18 out.mp4
```

Size the phone shell to exactly 720 × 1280 before capture (`deviceScaleFactor: 1`), or capture
at 1440 × 2560 and downscale for crisp type.

## 7. Notes that save you a rebuild

- **Two easings, not ten.** `cubic-bezier(.16,1,.3,1)` for entrances,
  `cubic-bezier(.7,0,.2,1)` for punches. Most amateur motion is just inconsistent easing.
- **Glow ≠ big shadow.** One large `text-shadow` looks flat and muddy. Ladder five of them
  (2 → 14 → 38 → 78 → 140 px) and add one blurred duplicate behind.
- **Never animate the whole page.** Only the `.cam` wrapper and the scene content move; the
  device chrome is static so the frame feels like a camera, not a slideshow.
- **`isolation: isolate` on the glowing element** or the blurred `::before` will paint behind
  an ancestor background and silently vanish.
- **Respect `prefers-reduced-motion`** — the whole system degrades to a static layout with one
  media query because motion is CSS-driven.
- **Fonts matter more than the palette.** Weight 800–900 grotesque (Archivo, Helvetica Now,
  Inter Tight) + a mono for the micro-labels. Without the mono labels it looks like a template.

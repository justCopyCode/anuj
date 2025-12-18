# Anu's Cinematic Birthday Journey

A premium, emotional, single-page experience that feels like a love story unfolding—complete with suspense, memories, playful surprises, heartfelt letters, and a fireworks finale. Built with vanilla HTML/CSS/JS + GSAP so it deploys anywhere (GitHub Pages, Vercel, Netlify) without extra tooling.

## ✨ Features

1. **Suspenseful Landing** – Whispered intro lines, glow button, optional background music toggle.
2. **Memory Timeline** – Scroll-triggered milestones with photos & captions.
3. **Photo Magic** – Polaroid grid with randomized rotations that reveal love notes on tap.
4. **Surprise Reveal** – Locked gift box that unlocks the typewritten birthday letter.
5. **Heartfelt Letter** – Paragraph-by-paragraph typewriter animation with caret glow.
6. **Playful Interactions** – Mini quiz, tappable love meter, random compliment generator.
7. **Finale** – Fireworks canvas, floating hearts overlay, and a final declaration.
8. **Mobile-first** – All interactions are tap-friendly and fully responsive.

## 🗂 File Structure

```
anuj/
├── index.html      # Markup + GSAP CDN + audio reference
├── style.css       # Cinematic theme, gradients, animations
├── script.js       # Interactions, observers, typewriter, fireworks
├── anu 1.jpeg      # Timeline/class 10 photo (replace as needed)
├── anu 2.jpeg      # Timeline/class 11 photo
├── anu 3.jpeg      # Timeline/relationship photo
├── anu4.jpg        # Polaroid photo 1
├── anu5.jpg        # Polaroid photo 2
└── anu6.jpg        # Polaroid photo 3
```

> ⚠️ Filenames contain spaces (`anu 1.jpeg`). The HTML uses encoded paths (`anu%201.jpeg`). If you rename the files, update the `src` attributes.

## 🚀 Running & Deploying

No build step needed.

```bash
# open locally
python -m http.server 5500
# or use Live Server / VS Code Go Live
```

Deploy options:

- **GitHub Pages**: push repo → Settings → Pages → choose branch/root.
- **Vercel/Netlify**: import the repo and set root directory to project folder.

## 🛠 Customization

| Area                    | How to tweak                                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Colors & type           | Edit CSS variables in `style.css` (`:root`). Fonts are loaded in `<head>` of `index.html` from Google Fonts.     |
| Photos                  | Replace the local `anu*.jpg` files or point `src` to hosted URLs. Maintain similar aspect ratio for best layout. |
| Timeline text           | Edit each `.milestone` block in `index.html`.                                                                    |
| Polaroid captions/notes | Update `data-note` attribute and `<span>` text in `index.html`.                                                  |
| Birthday letter         | Modify paragraphs inside `.letter__inner`. The JS auto-animates whatever text is present.                        |
| Quiz                    | Buttons live in `.quiz .options`. Mark the correct answer with `data-correct="true"`.                            |
| Compliments             | Update the `compliments` array in `script.js`.                                                                   |
| Audio                   | Replace the `<source>` URL in `index.html`. Ensure CORS-friendly hosting.                                        |

## 💡 Notes

- All major animations are documented with descriptive class names (e.g., `.milestone.visible`, `.letter__inner p.typing`).
- GSAP is only used for the hero entrance; everything else is CSS/vanilla JS to keep bundle small.
- The floating hearts and fireworks are lightweight canvas/DOM animations that run continuously; adjust the intervals in `script.js` if you want fewer particles.
- Background music is **muted by default** and can be toggled to respect autoplay policies.

Make it yours: drop in more sections, swap photos, or add new love games. Have fun and happy gifting! 💖

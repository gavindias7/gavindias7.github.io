# Gavin Dias — AI Engineer Portfolio

The personal portfolio and resume website of **Gavin Dias**, AI Agent Engineer & Lead Software Architect. This project serves as a showcase of my technical background, core skills, and large-scale AI impact.

> [!TIP]
> This entire project was **vibe coded** using **Antigravity**, backed by **Gemini 3.1 Pro** and **Claude Sonnet 4.6**.

**Live Site:** [gavindias7.github.io](https://gavindias7.github.io/)

---

## ⚡ Key Features

This site was built with a deliberate focus on performance, dynamic interactivity, and a premium "AI-native" aesthetic without relying on massive frontend frameworks. 

- **Zero-Dependency Architecture:** Built entirely with raw, vanilla HTML, CSS, and JavaScript. No React, Vue, or heavy libraries, ensuring blazing-fast load times.
- **Neural Network Canvas:** A custom-built, interactive 2D canvas background featuring interconnected nodes that dynamically respond to mouse movements and theme changes.
- **Custom Cursor & Interactions:** Implemented a bespoke cursor system (dot and tracking ring) with stateful hover and click animations. 
- **Theming System:** Fully supported, user-toggleable Dark and Light modes. Transitions seamlessly adjust CSS variables, layout shadows, and canvas drawing styles. The site falls back to system preferences on the first visit.
- **Fully Responsive Layout:** Utilizes modern CSS Grid layout (`auto-fit`, `minmax`), Flexbox, and fluid typography (`clamp()`) to adapt flawlessly across mobile, tablet, and desktop viewports.
- **Accessibility Aware:** Includes support for `prefers-reduced-motion` media queries, ensuring that kinetic animations (like the neural canvas and cursor) adapt for users who prefer minimal movement.

---

## 🛠️ Technology Stack

* **Structure:** Semantic HTML5
* **Styling:** CSS3, CSS Custom Properties (Variables), Flexbox, CSS Grid
* **Interactivity:** Vanilla JavaScript (`requestAnimationFrame`, Canvas API, IntersectionObserver)
* **Typography:** [Inter](https://fonts.google.com/specimen/Inter) (Body/UI) and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (Code/Technical accents) via Google Fonts.
* **Hosting:** GitHub Pages

---

## 📁 Repository Structure

```text
/
├── index.html       # Main content and semantic structure
├── styles.css       # Complete design system, animations, and responsive rules
├── script.js        # Canvas drawing loop, cursor logic, scroll reveal, and theme toggle
├── profile.jpg      # High-res profile image
└── README.md        # This documentation
```

---

## 🚀 Local Development

Since this project has zero build steps and no dependencies, running it locally is incredibly simple.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gavindias7/gavindias7.github.io.git
   ```
2. **Navigate to the directory:**
   ```bash
   cd gavindias7.github.io
   ```
3. **Serve the files:**
   You can use any local web server. For example, if you have Python installed, run:
   ```bash
   python -m http.server 8000
   ```
   *Then open `http://localhost:8000` in your browser.*

---

## 📬 Contact / Socials

- **LinkedIn:** [gavin-dias](https://www.linkedin.com/in/gavin-dias)
- **GitHub:** [gavindias7](https://github.com/gavindias7)

*Designed & built with intelligence by Gavin Dias.*

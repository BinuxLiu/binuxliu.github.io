# Bingxi Liu · Personal Homepage

A bilingual, text-first academic homepage for visual localization, 3D perception, and embodied intelligence. The site runs directly on GitHub Pages with no runtime dependencies or external font services.

## Editing

- `data/profile.json` contains publication records, explicit statuses, selected-work flags, verified authors, thumbnail paths, resource links, and bilingual student mentoring entries.
- `scripts/build.mjs` contains the shared page template and bilingual biography, projects, experience, and awards.
- `assets/css/style.css` controls the responsive design.
- `assets/js/main.js` adds mobile navigation, selected/all/published/under-review publication filters, and language preference storage.

After editing the data or template, run:

```sh
npm run build
npm run check
```

Commit the generated `zh/index.html` and `en/index.html` together with the source changes. GitHub Pages serves the repository root; `.nojekyll` keeps it a plain static site. Existing `/zh/index.html` and `/en/index.html` URLs remain valid. The root chooses the saved language preference, then the browser language; without JavaScript it offers both languages.

For local preview, serve this directory with any static HTTP server, for example `python -m http.server 8765`, then open `http://localhost:8765/zh/`.

## Content and accessibility

The October 2026 résumé supplied by the owner is the source for academic and professional facts. Published, under-review, and submitted work are labeled separately. The ICRA motion-knowledge entry was updated to 2021 after owner clarification and verification against the coauthor’s official CAS profile. Private contact details, hiring offers, internal data volumes, and the original résumé file are not included.

Public project links were checked against the owner's repositories. NPR's 2024 venue is confirmed by its [repository citation](https://github.com/BinuxLiu/NPR); NocPlace links to its [public preprint](https://arxiv.org/abs/2402.17159). The English company name EngineAI follows its [official site](https://en.engineai.com.cn/about-us).

Advisor introductions and homepage links were checked against [Hong Zhang's SUSTech profile](https://faculty.sustech.edu.cn/zhangh33/) and [Yihong Wu's UCAS profile](https://people.ucas.edu.cn/~wuyihong). LeRobot practice is retained as a short, initially collapsed entry after the main projects and is not featured in News.

The owner supplied the three student mentoring entries on October 26, 2026: Huaqi Tao (Guangxi University → SUSTech), An Liu (Chongqing University → CASIA), and Tingjun Huang (SUSTech → ETH Zurich). The text describes undergraduate research mentoring from their first research experience and preserves the supplied institutional paths without inferring degrees, dates, admission status, or a causal link between mentoring and later destinations.

Core content and project details work without JavaScript. Navigation has keyboard focus indicators and a skip link. All 22 research records are readable without JavaScript; the enhanced view initially selects four illustrated works. News and project disclosures use native details elements. Smooth scrolling respects reduced-motion preferences. The compact, text-first layout follows academic profile → news → publications → mentoring → background → projects → honors, using a white background, plain headings, and blue text links. It is inspired by [Shuming Liu's academic homepage](https://sming256.github.io/).

## Research figure sources

The four paper thumbnails are unmodified original figures from the author papers, embedded locally with contained sizing.

- [MT-PCR, Figure 3](https://arxiv.org/html/2506.13183v2): framework. Author names and equal-contribution markers follow the [formal CVM paper](https://iccvm.org/2026/files/papers/373.pdf).
- [SplatHLoc, Figure 1](https://arxiv.org/html/2603.29185v1): teaser; CVPR 2026 is confirmed in the authors’ repository.
- [NocPlace, Figure 4](https://arxiv.org/html/2402.17159v2): knowledge-transfer framework. The author list is intentionally abbreviated because public versions differ in ordering.
- [SuperPlace, Figure 2](https://arxiv.org/html/2506.13073v1): feature aggregation architecture; its journal submission is explicitly labeled under review.

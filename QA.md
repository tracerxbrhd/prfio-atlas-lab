# Quality evidence

Validated on Windows with Node.js 24.19.0, Chromium 153 and the committed dependency lockfile. Final checks completed September 8, 2026.

| Check | Result |
| --- | --- |
| ESLint | Passed |
| Prettier source formatting | Passed |
| Playwright suite | 9 tests passed |
| Responsive widths | 360, 768, 1440, 2560 px; no document overflow |
| axe WCAG 2 A/AA and 2.1 A/AA rules | Zero violations in tested views |
| Production build | Passed |
| Repository base /prfio-atlas-lab/ | HTTP 200; zero runtime or asset errors |
| Local screenshots | Captured from running UI |

## Reproduce

~~~bash
npm ci
npx playwright install chromium
npm run lint
npm test
npm run build
~~~

On this workspace the browser download was shared through PLAYWRIGHT_BROWSERS_PATH; a fresh checkout uses Playwright's normal browser location. The committed configuration uses a project-specific test port, so repositories do not reuse one another's test servers.

## Coverage

Unique dataset identifiers and indicator bounds; combined region/search/score filtering; empty states and reset; profile dialogs; three-city comparison limit and table values; context-driven field-note comparisons; filtered CSV downloads; scatterplot switching; responsive explorer/comparison/notes; console errors; automated accessibility across explorer, profile, comparison and notes.

## Fixes made during review

Small secondary labels were increased to at least 12px. Secondary text colours were checked and corrected where necessary. Tests use native control roles and explicitly wait for lazy images. Pages base-path validation exercises built files, the credits page and primary interactions.

## Verification limits

Automated accessibility checks complement keyboard and visual review; they are not a complete accessibility certification. Browser testing here used Chromium. GitHub Actions and the actual Pages deployment have not run remotely because GitHub CLI is not installed in this environment; authentication could not be checked. A live URL must be added only after successful publication.

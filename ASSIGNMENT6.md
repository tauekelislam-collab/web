# Assignment 6 — jQuery

STEPUP sneaker store. Existing project content and team details are preserved.
Website: https://tauekelislam-collab.github.io/web/

## Tasks and demonstration

0. Every HTML head loads jQuery 4.0.0 from the required CDN before the custom scripts. A local copy runs only if the CDN failed. `js/assignment6.js` uses `$(document).ready()` and prints `jQuery is ready!`.
1. Catalog: type in Search models. `js/assignment5.js` now uses jQuery `.on()` and `.filter()` to combine live search, brand and budget. Reset restores all cards and the empty-state message handles no matches.
2. Catalog: suggestions appear under the search field. Click one to apply it, or use Down then Enter. Escape dismisses the suggestions.
3. Catalog: every matching occurrence in product titles is highlighted. Clearing/resetting restores the original title text. Text nodes and `<mark>` elements keep user input safe, including characters such as `<`, `[` and `*`.
4. All pages: a gradient progress bar tracks the scrollable distance using jQuery scroll/resize handlers, `.css()` and accessible numeric state.
5. Home: collection counters animate from zero to 6 models, 3 featured brands and 9 gallery styles when scrolled into view. These reflect the demo collection, not invented customer statistics.
6. Contact: complete the three-step order request and confirm. After validation, the button shows a spinner and Please wait… for 1.2 seconds. Form controls are temporarily disabled and a busy guard prevents repeated submissions. This simulates a server call; no data is sent.
7. Successful demo completion or copying shows a temporary toast which fades out. Repeated notifications cancel the previous timer.
8. Contact: Copy link copies the displayed catalog URL using the browser Clipboard API, triggered by a jQuery click handler. A checkmark, tooltip and visible feedback confirm success. A denied/unavailable clipboard shows a manual-copy message instead of false success. Use HTTPS or localhost.
9. Gallery: real image paths are stored in `data-src` in the HTML, so offscreen images are not downloaded in advance. On scroll, `.offset()` checks visibility and `.attr('src')` starts loading. Existing gallery dimensions reserve space.

## Day / Night mode (Assignment 5)

The header button switches the whole site between light and dark themes. `js/theme.js` changes the HTML theme attribute and Bootstrap navbar theme, resets any custom background, and remembers the choice in localStorage. Storage failure does not prevent switching. Existing Change Background also uses light colors in Day mode.

## Files

- `js/assignment6.js`: suggestions, highlighting, progress, counters, demo loading, toasts, clipboard and gallery lazy loading.
- `css/assignment6.css`: new components, readable light theme and reduced-motion support.
- `js/theme.js`: shared theme switch.
- `js/assignment5.js`: existing filter migrated to jQuery, validated form connected to loading feedback. Ratings, callbacks, objects, arrays, keyboard navigation and sound remain.
- `js/script.js`: original Assignment 4 behavior, with theme-aware background colors.

## Submission

Each student must submit the complete project ZIP and a separate PDF report with team/members/group, task steps, code and page screenshots, deployed URL and reflection. This guide is not the PDF report. Defense counts for 40%.

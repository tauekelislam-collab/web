# Assignment 5 — STEPUP Sneaker Store

Team: STEPUP. Members: Tazhmaganbetov Rakhat and Tauyekel Islam. Group: SE-2508.

Website: https://tauekelislam-collab.github.io/web/

## Implementation and demonstration

1. **DOM selection and content:** open Catalog. `initializeCatalog()` selects existing product cards with `querySelectorAll`, reads their names, brands and prices into an array of objects, then updates the result count with `textContent`.
2. **Dynamic styles:** the existing footer Change Background button updates `document.body.style.backgroundColor`. Day/night mode is an alternative in the assignment, not an additional requirement.
3. **Chosen interactive option — star rating:** each catalog card has five buttons. Click a star to set your personal rating for this visit. A loop creates the buttons, a callback updates the object's rating, `classList.toggle` changes their color, and `setAttribute` updates accessible pressed state. Refreshing clears ratings; these are not public customer reviews.
4. **Button event listeners:** filter reset, rating, sound and form buttons use `addEventListener`. Reset filters restores all six models without a reload.
5. **Keyboard navigation:** focus a top navigation link using Tab. Arrow keys move between links and wrap at the ends. Home/End move to the first/last link. Enter follows the focused link. On mobile, expand the menu first.
6. **Callbacks and multi-step form:** on Contact, enter name/email, select sneakers and size, then review and confirm. `moveStep(direction, onStepChange)` receives `showStep` as a callback. Fields stay in the DOM, so Back preserves their values. Validation stops invalid steps. Reset clears values and returns to step one. This is the selected alternative to asynchronous POST: no server or real order submission is required.
7. **Switch:** `matchesBudget()` chooses between all prices, under 60,000 KZT and 60,000 KZT or above. Keyboard navigation also uses switch.
8. **Objects and methods:** product objects hold name, brand, price and rating. `request.getDetails()` reads form data and `request.renderSummary()` displays it safely. `storeSound.play()` manages audio.
9. **Arrays and loops:** `products` and `steps` are arrays. A `for` loop creates rating buttons and loops validate fields/steps.
10. **Higher-order functions:** `map` converts cards into product objects, `filter` selects matching products and `forEach` updates the DOM. Each receives a function as its argument.
11. **Sounds:** enable Sound in the footer, then rate a product or complete the form. Web Audio generates a short notification tone, so no external audio file is needed. A shared audio context and single active oscillator prevent overlapping tones. Sound defaults to off.
12. **Animations:** changes to catalog results, ratings and form steps trigger `animateElement()`. It animates opacity/transform, cancels earlier animations and respects reduced-motion preferences. Existing FAQ and background transitions remain.
13. **Separation:** markup is in HTML, new styling is in `css/assignment5.css`, and new behavior is in `js/assignment5.js`. Assignment 4 features remain in `js/script.js`; its old order handler was replaced by the multi-step handler to avoid duplicate submissions.
14. **Theme and usability:** existing sneaker images, pages, product details and orange/dark styling are preserved. Filters combine brand, price and search. Empty results explain how to recover. Buttons have labels and keyboard focus styles.

## Defense examples

- DOM: the browser's representation of the HTML document.
- Event listener: a function the browser calls when an event occurs.
- Callback: a function passed into another function, such as `showStep` passed to `moveStep`.
- Higher-order function: a function that accepts or returns a function, such as `filter`.
- Method: a function belonging to an object, such as `request.renderSummary()`.
- `textContent` displays input as text, preventing typed markup from becoming executable HTML.
- Hidden steps retain field values; hiding a step does not recreate its inputs.
- Challenges: preventing two order submit handlers, reporting errors only on visible steps, combining filters, avoiding overlapping sounds and maintaining mobile layout.

## Submission checklist

The code is only one part of the submission. Each member must also upload a ZIP of project files and a PDF report in LMS before the deadline, then defend the work.

The PDF must include the team/members/group, objective, each task's steps, code screenshots and webpage screenshots, deployed URL and reflection. This Markdown guide is preparation material, not a replacement for the required PDF report.

## Verification

Verified all five pages in headless Chromium: no uncaught JavaScript errors; background switching, subscription dialog and keyboard navigation work. Tested combined filters, no-results state, reset, rating changes and audio context playback. Tested invalid and whitespace-only names, invalid email, missing model/size/agreement, Back retaining input, safe display of typed HTML, valid completion and reset. Checked Catalog and Contact at 390 px width for horizontal overflow and inspected desktop/mobile screenshots. Bootstrap 5.3.3 is bundled locally in `vendor/bootstrap` with its MIT license so layout and mobile navigation do not depend on a CDN.

# Assignment 4: JavaScript defense guide

Team: STEPUP. Group: SE-2508.
Members: Tazhmaganbetov Rakhat and Tauekel Islam (also spelled Tauyekel Islam in the existing pages).

## Where to demonstrate each task

1. Contact: scroll to Create a STEPUP Account. Submit empty fields, an invalid email, a short password, mismatched passwords, then valid sample values. `preventDefault()` stops navigation; `.value` reads fields; conditions set inline error text and `aria-invalid`. No credentials are stored or transmitted.
2. Home: FAQ answers start closed. Click a question twice. A loop registers listeners; `aria-expanded` tracks state; `classList.toggle()` and CSS grid animate the answer.
3. Every page: Subscribe in the footer opens a hidden `<dialog>`. Close with the cross, backdrop or Escape. `showModal()` opens it and `close()` closes it. The subscription is a demo.
4. Every page: Change Background cycles an array of dark colors. The index advances using `%` and updates `document.body.style.backgroundColor`.
5. Every page: footer clock uses `new Date()`, readable local formatting and `setInterval(updateTime, 1000)`. The initial direct call avoids an empty clock during the first second.

All custom JavaScript is in `js/script.js`, loaded with `defer` on every HTML page. Optional page-specific elements are checked before registering handlers. The original order request keeps its model, size and agreement validation.

## Team work

Each member must personally implement or review and adapt at least one component and understand the others. Record the actual division of work in the report; do not claim generated code proves individual participation.

## Submission checklist

- Capture screenshots of all five tasks, including validation errors and successful validation.
- Report: team, members, group, objective, steps, screenshots, deployment URL and reflection.
- Verify the deployed website: https://tauekelislam-collab.github.io/web/
- Download the updated repository as ZIP (Code > Download ZIP).
- Each team member submits the report and project ZIP and defends their work.

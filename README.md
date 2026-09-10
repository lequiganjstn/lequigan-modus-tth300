# Modus — Inventory Management System

A 4-page static frontend prototype for an inventory management system (subject to change)

## Pages
- `index.html` — Dashboard: stock overview, stats, low/out-of-stock alerts
- `inventory.html` — View all items, search/filter, edit/delete
- `item-form.html` — Add a new item, or edit an existing one (`?id=...`)
- `categories.html` — View, add, edit, delete categories

## Notes
- Static frontend only — no backend yet.
- Data is seeded on load and kept in `sessionStorage` so edits persist while
  navigating between pages in the same tab session. This is a stand-in for
  a real database and will be replaced by a Node.js backend next.
- No frameworks used — plain HTML/CSS/JS, built to the provided Vercel/Geist
  design system.

## Run it
Open `index.html` in a browser, or serve the folder with any static server:

```
npx serve .
```

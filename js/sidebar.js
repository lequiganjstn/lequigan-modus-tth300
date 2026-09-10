// Renders the shared sidebar nav and marks the active link.
function renderSidebar(active) {
  const links = [
    { href: "index.html", key: "dashboard", label: "Dashboard", icon: gridIcon() },
    { href: "inventory.html", key: "inventory", label: "Inventory", icon: boxIcon() },
    { href: "item-form.html", key: "item-form", label: "Add Item", icon: plusIcon() },
    { href: "categories.html", key: "categories", label: "Categories", icon: tagIcon() },
  ];

  const nav = links
    .map(
      (l) => `
      <a class="nav-link ${l.key === active ? "active" : ""}" href="${l.href}">
        ${l.icon}
        <span>${l.label}</span>
      </a>`
    )
    .join("");

  return `
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark"></div>
        <span class="brand-name">Modus</span>
      </div>
      <div class="nav-group-label">MAIN</div>
      ${nav}
      <div class="sidebar-footer">Static preview · v0.1</div>
    </aside>`;
}

function gridIcon() {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" stroke-width="1.3"/></svg>`;
}
function boxIcon() {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.5 4.5L8 1.5L14.5 4.5V11.5L8 14.5L1.5 11.5V4.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M1.5 4.5L8 7.5L14.5 4.5" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M8 7.5V14.5" stroke="currentColor" stroke-width="1.3"/></svg>`;
}
function plusIcon() {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="13" height="13" rx="2.5" stroke="currentColor" stroke-width="1.3"/><path d="M8 5V11M5 8H11" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;
}
function tagIcon() {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8.6 1.5H2.5C1.94772 1.5 1.5 1.94772 1.5 2.5V8.6C1.5 8.86522 1.60536 9.11957 1.79289 9.30711L8.19289 15.7071C8.58341 16.0976 9.21658 16.0976 9.6071 15.7071L14.7071 10.6071C15.0976 10.2166 15.0976 9.58341 14.7071 9.19289L8.30711 2.79289C8.11957 2.60536 7.86522 2.5 7.6 2.5" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="5" cy="5" r="1" fill="currentColor"/></svg>`;
}
function searchIcon() {
  return `<svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" stroke-width="1.3"/><path d="M11 11L14.5 14.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;
}
function editIcon() {
  return `<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M11.3 2.3a1.5 1.5 0 0 1 2.1 2.1L5.5 12.3l-2.9.7.7-2.9 8-7.8Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>`;
}
function trashIcon() {
  return `<svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M2.5 4.5H13.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><path d="M6 4.5V2.5C6 2.22386 6.22386 2 6.5 2H9.5C9.77614 2 10 2.22386 10 2.5V4.5" stroke="currentColor" stroke-width="1.3"/><path d="M4 4.5L4.6 13.1C4.63 13.6 5.05 14 5.55 14H10.45C10.95 14 11.37 13.6 11.4 13.1L12 4.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;
}

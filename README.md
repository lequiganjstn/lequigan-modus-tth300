# Modus Inventory Management

Inventory management app built with Next.js, Express, and MySQL. The frontend runs at `http://localhost:3000`; the API runs at `http://localhost:4000`.

## Requirements
- Node.js 20 or newer
- XAMPP with MySQL enabled

## Database setup
1. Start MySQL in the XAMPP Control Panel.
2. Open phpMyAdmin at `http://localhost/phpmyadmin`.
3. Import `database/schema.sql`. It creates and seeds the `modus_inventory` database. **Importing it drops and recreates the app tables**, so back up any data you want to keep first.
4. Copy `.env.example` to `.env`. Set `DB_USER` and `DB_PASSWORD` to match the MySQL account configured in XAMPP. The default XAMPP settings are `root` with an empty password.

## Run locally
```bash
npm install
npm run dev
```

The development command starts Next.js and the Express API together. Use `npm run build` to build the frontend for production. The API can also be started independently with `npm run start:api`.

## API
- `GET /api/health` — API and database health check
- `GET, POST /api/items` — list and create inventory items
- `GET, PUT, DELETE /api/items/:id` — read, update, and delete an item
- `GET, POST /api/categories` — list and create categories
- `PUT, DELETE /api/categories/:id` — update and delete a category

Deleting a category leaves its items in inventory and clears their category assignment.

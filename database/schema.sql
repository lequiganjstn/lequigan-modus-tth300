CREATE DATABASE IF NOT EXISTS modus_inventory
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE modus_inventory;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE categories (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  color CHAR(7) NOT NULL DEFAULT '#0070f3',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_categories_name (name)
) ENGINE=InnoDB;

CREATE TABLE items (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  sku VARCHAR(64) NOT NULL,
  name VARCHAR(180) NOT NULL,
  category_id INT UNSIGNED NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 0,
  reorder_level INT UNSIGNED NOT NULL DEFAULT 0,
  unit_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  location VARCHAR(100) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_items_sku (sku),
  KEY idx_items_category_id (category_id),
  CONSTRAINT fk_items_category
    FOREIGN KEY (category_id) REFERENCES categories (id)
    ON UPDATE CASCADE
    ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT INTO categories (id, name, color) VALUES
  (1, 'Electronics', '#0070f3'),
  (2, 'Office Supplies', '#7928ca'),
  (3, 'Furniture', '#ab570a'),
  (4, 'Packaging', '#0c7a3a'),
  (5, 'Raw Materials', '#c50000');

INSERT INTO items (id, sku, name, category_id, quantity, reorder_level, unit_cost, location) VALUES
  (1, 'ELE-1042', 'Wireless Mouse M185', 1, 128, 30, 8.50, 'A1-03'),
  (2, 'ELE-2210', 'USB-C Hub 7-in-1', 1, 12, 20, 15.20, 'A1-07'),
  (3, 'OFF-0093', 'A4 Copy Paper (Ream)', 2, 0, 50, 3.40, 'B2-01'),
  (4, 'OFF-0147', 'Ballpoint Pens (Box of 12)', 2, 340, 60, 2.10, 'B2-04'),
  (5, 'FUR-3301', 'Ergonomic Task Chair', 3, 18, 5, 89.00, 'C1-01'),
  (6, 'FUR-3355', 'Standing Desk 120cm', 3, 6, 8, 145.00, 'C1-02'),
  (7, 'PKG-0421', 'Corrugated Box (Medium)', 4, 890, 200, 0.65, 'D3-11'),
  (8, 'PKG-0433', 'Bubble Wrap Roll 50m', 4, 24, 25, 12.00, 'D3-14'),
  (9, 'RAW-5510', 'Aluminum Sheet 2mm', 5, 3, 10, 34.75, 'E1-01'),
  (10, 'RAW-5522', 'PLA Filament 1kg', 5, 56, 15, 19.90, 'E1-05'),
  (11, 'ELE-2288', '27in Monitor 1440p', 1, 9, 10, 210.00, 'A1-11'),
  (12, 'OFF-0201', 'Sticky Notes 3x3 (Pack)', 2, 175, 40, 1.15, 'B2-08');

ALTER TABLE categories AUTO_INCREMENT = 6;
ALTER TABLE items AUTO_INCREMENT = 13;
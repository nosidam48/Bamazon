DROP DATABASE bamazon_customer_db;
-- Created the DB "wizard_schools_db" (only works on local connections)
CREATE DATABASE bamazon_customer_db;
USE bamazon_customer_db;

-- Created the table "schools" 
CREATE TABLE products
(
  item_id INT AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255),
  price DECIMAl(10,4) NULL,
  stock_quantity INT NULL,
  product_sales INT DEFAULT 0,
  PRIMARY KEY (id),
);

  -- Inserted a set of records into the table
  INSERT INTO products (product_name, department_name, price, stock_quantity)
  VALUES ("Witcher 3", "Games", 50, 70);
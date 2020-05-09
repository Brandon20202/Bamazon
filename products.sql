CREATE DATABASE burgers_db;
USE burgers_db;

CREATE TABLE products
(
	item_id int NOT NULL AUTO_INCREMENT,
    product_name varchar(70) NOT NULL,
	department_name VARCHAR(70) not null,
    price decimal(7,4) not null,
    stock_quantity int not null,
	PRIMARY KEY (item_id)
);
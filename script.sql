CREATE SCHEMA `itemsnodebd` ;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL
);

INSERT INTO users (username, password) VALUES
('admin', '1234'),
('user', 'abcd');

CREATE TABLE items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

INSERT INTO items (name, description) VALUES
('Item 1', 'Primer item'),
('Item 2', 'Segundo item');

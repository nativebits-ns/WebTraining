CREATE TABLE Customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  city TEXT,
  email TEXT
);

CREATE TABLE Products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  product_name TEXT NOT NULL,
  category VARCHAR(200) DEFAULT 'General',
  price INT NOT NULL
);

CREATE TABLE Orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  order_date TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES Customers(customer_id),
  FOREIGN KEY (product_id) REFERENCES Products(product_id)  
);

-- Populate Customers
INSERT INTO Customers (customer_name, city, email) VALUES
('Aarav Sharma', 'Mumbai', 'aarav.sharma@example.com'),
('Priya Patel', 'Ahmedabad', 'priya.patel@example.com'),
('Rohan Verma', 'Delhi', 'rohan.verma@example.com'),
('Ananya Iyer', 'Bengaluru', 'ananya.iyer@example.com'),
('Vikram Singh', 'Jaipur', 'vikram.singh@example.com'),
('Sneha Kulkarni', 'Pune', 'sneha.kulkarni@example.com'),
('Kabir Nair', 'Kochi', 'kabir.nair@example.com'),
('Meera Reddy', 'Hyderabad', 'meera.reddy@example.com'),
('Arjun Das', 'Kolkata', 'arjun.das@example.com'),
('Divya Joshi', 'Chandigarh', 'divya.joshi@example.com'),
('Rohan Deshmukh', 'Bengaluru', 'rohan.d@example.com'),
('Ananya Verma', 'Delhi', 'ananya.verma@example.com'),
('Vikram Joshi', 'Hyderabad', 'vikram.joshi@example.com');

-- Populate Products
INSERT INTO Products (product_name, category, price) VALUES
('Wireless Mouse', 'Electronics', 799),
('Mechanical Keyboard', 'Electronics', 3499),
('USB-C Hub', 'Accessories', 1499),
('Laptop Stand', 'Accessories', 1299),
('Noise-Cancelling Headphones', 'Audio', 5999),
('27-Inch Monitor', 'Electronics', 14500),
('Desk Mat', 'Office Supplies', 499),
('Webcam 1080p', 'Electronics', 2299),
('Ergonomic Chair', 'Furniture', 11999),
('Portable SSD 1TB', 'Storage', 6499);

-- Populate Orders
INSERT INTO Orders (customer_id, product_id, quantity, order_date) VALUES
(1, 1, 2, '2026-01-05'),
(2, 5, 1, '2026-01-08'),
(3, 2, 1, '2026-01-12'),
(4, 6, 1, '2026-01-15'),
(5, 3, 3, '2026-01-19'),
(1, 4, 1, '2026-01-22'),
(6, 7, 2, '2026-02-01'),
(7, 9, 1, '2026-02-04'),
(8, 10, 1, '2026-02-10'),
(9, 8, 2, '2026-02-14'),
(10, 1, 1, '2026-02-18'),
(2, 3, 2, '2026-02-25'),
(3, 5, 1, '2026-03-02'),
(4, 10, 2, '2026-03-07'),
(5, 7, 4, '2026-03-11'),
(6, 2, 1, '2026-03-15'),
(7, 4, 2, '2026-03-20'),
(8, 6, 1, '2026-03-24'),
(9, 9, 1, '2026-03-28'),
(10, 8, 1, '2026-04-02');


-- Section 1: Advanced Joins
-- Task 1: Display each customer along with the products they ordered.
SELECT * FROM Customers AS C
LEFT JOIN Orders AS O 
    ON C.customer_id = O.customer_id
LEFT JOIN Products AS P 
    ON O.product_id = P.product_id;

-- Task 2: Display all possible combinations of customers and products using a CROSS JOIN.
SELECT * FROM Customers AS C CROSS JOIN Products AS P;

-- Task 3: Display all customers and their orders, including customers who have not placed any orders.
SELECT * FROM Customers AS C
LEFT JOIN Orders AS O 
    ON C.customer_id = O.customer_id;

-- Section 2: Subqueries
-- Task 4: Find products priced above the average product price.
SELECT * FROM Products WHERE PRICE > (SELECT AVG(Price) FROM Products);

-- Task 5: Display customers whose total purchase amount is greater than the average customer purchase amount.
SELECT 
    C.customer_id,
    C.customer_name,
    SUM(P.price) AS total_purchase
FROM Customers AS C
JOIN Orders AS O 
    ON C.customer_id = O.customer_id
JOIN Products AS P 
    ON O.product_id = P.product_id
GROUP BY 
    C.customer_id
HAVING SUM(P.price) > (
    SELECT AVG(customer_total) FROM (
        SELECT SUM(P2.price) AS customer_total
        FROM Orders AS O2
        JOIN Products AS P2 
            ON O2.product_id = P2.product_id
        GROUP BY O2.customer_id
    ) AS CustomerTotals
);

-- Task 6: Find the highest-priced product in each category using a correlated subquery.
SELECT * FROM Products AS P1 WHERE P1.price = (SELECT MAX(P2.price) FROM Products AS P2 WHERE P2.category = P1.category);

-- Section 3: Set Operations
-- Task 7: Combine products from two different categories using UNION.
SELECT * FROM Products WHERE category='Accessories' UNION SELECT * FROM Products WHERE category='Electronics';

-- Task 8: Write MySQL alternatives for INTERSECT and EXCEPT using INNER JOIN and LEFT JOIN.
SELECT DISTINCT C.customer_id
FROM Customers AS C
INNER JOIN Orders AS O 
    ON C.customer_id = O.customer_id;

SELECT DISTINCT C.customer_id
FROM Customers AS C
LEFT JOIN Orders AS O 
    ON C.customer_id = O.customer_id
WHERE O.customer_id IS NULL;

-- Section 4: Window Functions
-- Task 9: Rank products by price within each category.
SELECT 
    product_name,
    category,
    price,
    RANK() OVER(PARTITION BY category ORDER BY price DESC) AS price_rank
FROM Products;

-- Task 10: Display the previous product price (LAG) and a running total of product prices using window functions.
SELECT 
    product_id,
    product_name,
    price,
    LAG(price) OVER(ORDER BY product_id) AS previous_price,
    SUM(price) OVER(ORDER BY product_id) AS running_total
FROM Products;

-- Section 5: Common Table Expressions (CTEs)
-- Task 11: Create a CTE to display customers whose total purchase amount is above the average.
WITH CTE_TASK1 AS (
  SELECT C.customer_name, P.product_name, P.price FROM Customers AS C 
  JOIN Orders AS O 
    ON C.customer_id = O.customer_id 
  JOIN Products AS P 
    ON O.product_id = P.product_id 
  WHERE P.price > (SELECT AVG(P2.price) FROM Products AS P2)
)
SELECT * FROM CTE_TASK1;

-- Task 12: Create a recursive CTE to generate a sequence of numbers from 1 to 10.
WITH RECURSIVE NumberSequence AS (
    SELECT 1 AS n    

    UNION ALL

    SELECT n + 1
    FROM NumberSequence
    WHERE n < 10
)
SELECT n  FROM NumberSequence;

-- Section 6: Views
-- Task 13: Create a view that displays products priced above ₹1,000 and retrieve data from the view.
CREATE VIEW Task13 AS SELECT * FROM Products WHERE price > 1000;

SELECT * FROM Task13;

-- Section 7: Indexes and Query Performance
-- Task 14: Create an index on the category column of the Products table.
CREATE INDEX idx_products_category ON Products (category);

-- Task 15: Use EXPLAIN to analyze a query that filters products by category.
EXPLAIN SELECT * FROM Products WHERE category = 'Electronics';

-- Section 8: Stored Procedures and Functions
-- Task 16: Create a stored procedure to retrieve products by category
CREATE PROCEDURE GetProductsByCategory(IN p_category VARCHAR(100))
SELECT * FROM Products WHERE category = p_category; 

CALL GetProductsByCategory('Electronics');

-- Task 17: Create a function to calculate the total price of an order (price x quantity).
CREATE FUNCTION CalculateOrderTotal(
    p_price DECIMAL(10, 2),
    p_quantity INT
) 
RETURNS DECIMAL(10, 2)
RETURN p_price * p_quantity;

SELECT CalculateOrderTotal(500.00, 3) AS order_total;

-- Task 18: Write a transaction that updates a product's price and demonstrate COMMIT and ROLLBACK.
START TRANSACTION;

UPDATE Products 
SET price = 99999.00 
WHERE product_id = 1;

ROLLBACK;

START TRANSACTION;

UPDATE Products 
SET price = 1499.00 
WHERE product_id = 1;

COMMIT;

-- Section 10: SQL Triggers
-- Task 19: Create a trigger that automatically records new orders in an Order_Audit table whenevera new order is inserted.
CREATE TABLE IF NOT EXISTS Order_Audit (
    audit_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    customer_id INT,
    product_id INT,
    action_type VARCHAR(50),
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER //

CREATE TRIGGER trg_AfterOrderInsert
AFTER INSERT ON Orders
FOR EACH ROW
BEGIN
    INSERT INTO Order_Audit (order_id, customer_id, product_id, action_type)
    VALUES (NEW.order_id, NEW.customer_id, NEW.product_id, 'NEW ORDER INSERTED');
END //

DELIMITER ;

-- Section 11: Performance Tuning
-- Task 20: Optimize the queries by applying SQL performance tuning best practices:
-- eg:
-- SELECT DISTINCT *
-- FROM Products
-- WHERE YEAR(created_date) = 2024
-- AND category = 'Electronics';
-- Apply the following improvements:
-- 1. Avoid SELECT *.
-- 2. Remove unnecessary DISTINCT.
-- 3. Avoid functions on indexed columns.
-- 4. Use an index-friendly query.
CREATE INDEX idx_products_category_created ON Products (category, created_date);

SELECT 
    product_id,
    product_name,
    category,
    price,
    created_date
FROM Products
WHERE category = 'Electronics'
  AND created_date >= '2024-01-01'
  AND created_date < '2025-01-01';
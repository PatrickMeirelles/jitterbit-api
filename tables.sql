CREATE TABLE "Order" (
    orderId VARCHAR(50) PRIMARY KEY,
    value DECIMAL(10, 2) NOT NULL,
    creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Items (
    orderId VARCHAR(50) PRIMARY KEY,
    productId INT,
    quantity INT,
    price DECIMAL(10, 2)
);
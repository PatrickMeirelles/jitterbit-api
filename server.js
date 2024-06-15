const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { client, connect } = require("./database");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connect().catch((err) => {
  console.error("Error to connect", err);
  process.exit(1);
});

app.get("/", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM items");
    res.json(result.rows);
  } catch (error) {
    console.error("Error searching data:", error);
    res.status(500).json({ error: "Error search at database" });
  }
});

app.post("/order", async (req, res) => {
  try {
    const catchResponse = {
      orderid: req.body.numeroPedido,
      value: req.body.valorTotal,
      creationdate: req.body.dataCriacao,
    };
    const productidRaw = req.body.items.map((item) => parseInt(item.idItem));
    const productid = productidRaw[0];
    const quantityRaw = req.body.items.map((item) => item.quantidadeItem);
    const quantity = quantityRaw[0];
    const valueRaw = req.body.items.map((item) => item.valorItem);
    const price = valueRaw[0];
    const catchResponseItems = {
      productid,
      quantity,
      price,
      orderid: req.body.numeroPedido,
    };
    const queryOrder =
      'INSERT INTO "Order" (orderid, value, creationdate) VALUES ($1, $2, $3) RETURNING *';
    const queryItems =
      "INSERT INTO Items (orderid, productid, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *";
    const valuesOrder = [
      catchResponse.orderid,
      catchResponse.value,
      catchResponse.creationdate,
    ];
    const valuesItems = [
      catchResponseItems.orderid,
      catchResponseItems.productid,
      catchResponseItems.quantity,
      catchResponseItems.price,
    ];
    const Order = await client.query(queryOrder, valuesOrder);
    const Items = await client.query(queryItems, valuesItems);
    res.status(201).json({
      message: "Order created successfully",
      Order: Order.rows[0],
      Items: Items.rows[0],
    });
  } catch (error) {
    console.error("Error created order:", error);
    res.status(500).json({ error: "Error created order" });
  }
});

app.get("/order", async (req, res) => {
  const orderId = req.query.id;
  try {
    const queryOrders = 'SELECT * FROM "Order" WHERE orderid = $1';
    const queryItems = "SELECT * FROM Items  WHERE orderid = $1";

    const resultOrders = await client.query(queryOrders, [orderId]);
    const resultItems = await client.query(queryItems, [orderId]);

    const orders = resultOrders.rows.map((order) => {
      const items = resultItems.rows.filter(
        (item) => item.orderid === order.orderid
      );
      return {
        orderId: order.orderid,
        value: order.value,
        creationDate: order.creationdate,
        Items: items.map((item) => ({
          productId: item.productid,
          quantity: item.quantity,
          price: item.price,
        })),
      };
    });

    res.json({ orders });
  } catch (error) {
    console.error("Error searching orders:", error);
    res.status(500).json({ error: "Error searching orders" });
  }
});

app.get("/order/list", async (req, res) => {
  try {
    const queryOrders = 'SELECT * FROM "Order"';
    const queryItems = "SELECT * FROM Items";

    const resultOrders = await client.query(queryOrders);
    const resultItems = await client.query(queryItems);

    const orders = resultOrders.rows.map((order) => {
      const items = resultItems.rows.filter(
        (item) => item.orderid === order.orderid
      );
      return {
        orderId: order.orderid,
        value: order.value,
        creationDate: order.creationdate,
        Items: items.map((item) => ({
          productId: item.productid,
          quantity: item.quantity,
          price: item.price,
        })),
      };
    });

    res.json({ orders });
  } catch (error) {
    console.error("Error searching orders:", error);
    res.status(500).json({ error: "Error searching orders" });
  }
});

app.put("/order", async (req, res) => {
  const orderIdQuery = req.query.id;
  const { value, creationDate, orderId } = req.body;
  try {
    const query =
      'UPDATE "Order" SET value = $1, creationdate = $2, orderid = $4 WHERE orderid = $3';
    const values = [value, creationDate, orderIdQuery, orderId];
    const result = await client.query(query, values);

    if (result.rowCount > 0) {
      res
        .status(200)
        .json({ message: `Order ${orderId} updated successfully` });
    } else {
      res.status(404).json({ error: `Order ${orderId} not found` });
    }
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Error updating order" });
  }
});

app.delete("/order", async (req, res) => {
  const orderId = req.query.id;
  try {
    const queryOrder = 'DELETE FROM "Order" WHERE orderid = $1';
    const queryItems = "DELETE FROM Items WHERE orderid = $1";
    const values = [orderId];
    const resultOrder = await client.query(queryOrder, values);
    const resultItems = await client.query(queryItems, values);

    if (resultOrder.rowCount > 0 && resultItems.rowCount > 0) {
      res
        .status(200)
        .json({ message: `Order ${orderId} deleted successfully` });
    } else {
      res.status(404).json({ error: `Pedido ${orderId} not found` });
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Error to delete order" });
  }
});

const port = 3000;
app.listen(port, function () {
  console.log(`server running at port:${port}`);
});

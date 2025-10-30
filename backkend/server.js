const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, image TEXT)`);
  db.run(`CREATE TABLE modifiers (id INTEGER PRIMARY KEY AUTOINCREMENT, productId INTEGER, name TEXT, price REAL)`);
  db.run(`CREATE TABLE orders (id INTEGER PRIMARY KEY AUTOINCREMENT, items TEXT, total REAL)`);

  const stmt = db.prepare("INSERT INTO products (name, price, image) VALUES (?, ?, ?)");
  stmt.run("Chlebek Fantazja", 5.0, "https://via.placeholder.com/150");
  stmt.run("Marmolada Magiczna", 3.5, "https://via.placeholder.com/150");
  stmt.run("Kiełbaska z lasu", 7.0, "https://via.placeholder.com/150");
  stmt.finalize();

  const modStmt = db.prepare("INSERT INTO modifiers (productId, name, price) VALUES (?, ?, ?)");
  modStmt.run(1, "Dżem malinowy", 1.0);
  modStmt.run(1, "Masło orzechowe", 1.5);
  modStmt.run(2, "Czekolada", 1.0);
  modStmt.run(2, "Bita śmietana", 1.2);
  modStmt.run(3, "Sos czosnkowy", 0.8);
  modStmt.run(3, "Ser cheddar", 1.5);
  modStmt.finalize();
});

app.get('/menu', (req, res) => db.all("SELECT * FROM products", (err, rows) => res.json(rows)));
app.get('/modifiers/:productId', (req, res) => db.all("SELECT * FROM modifiers WHERE productId = ?", [req.params.productId], (err, rows) => res.json(rows)));
app.post('/orders', (req, res) => {
  const { items, total } = req.body;
  db.run("INSERT INTO orders (items, total) VALUES (?, ?)", [JSON.stringify(items), total], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ orderId: this.lastID });
  });
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));


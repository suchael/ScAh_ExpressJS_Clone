# ScAh_ExpressJS_Clone

> A minimalist Express.js-style web framework built from scratch using Node.js core modules — for educational, experimental, and portfolio purposes.

---

## 👋 Introduction

This project is a personal initiative by **Success Ahmed (ScAh)** (GitHub: [suchael](https://github.com/suchael)) to **rebuild the core behavior of Express.js** — entirely from scratch using just Node.js.

No frameworks or libraries like Express or Fastify were used.

It’s built from scratch to replicate express.js inorder to help further my understanding of:

- How HTTP servers work in Node.js
- How routing and middleware flow works
- How web frameworks like Express are structured internally

---

## ✅ What It Can Do (So Far)

1 - Create an HTTP server
2 - Define `GET` and `POST` routes
3 - Use middleware (`app.use()`)
4 - Send responses using:
5  - `res.send()`
6  - `res.status().send()`
7  - `res.json()`
8  - Parse query parameters (e.g., `/search?q=hello` → `req.query.q`)
9  - Chain middleware and route handlers like Express

---

## ❌ What It Can’t Do Yet (In Progress)

1 - No built-in body parsing (e.g., `req.body` for POST data)
2 - No route parameter parsing (e.g., `/user/:id`)
3 - No support for advanced HTTP methods like PUT, DELETE, PATCH
4 - No routing abstraction (like `Router()`)
5 - No support for templating engines or static files yet
6 - No error-handling middleware
7 - No async/await middleware support

---

## 🚀 Example Usage

```js
const ScAh_ExpressJS_Clone = require("./ScAh_ExpressJS_Clone");

const app = new ScAh_ExpressJS_Clone();

//1.  Example middle ware usage
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

//2.  example using a get request 
app.get("/", (req, res) => {
  res.status(200).send("Welcome to ScAh_ExpressJS_Clone!");
});

//3.  Example testing a query from a get request 
app.get("/hello", (req, res) => {
  const name = req.query.name || "Guest";
  res.json({ message: `Hello, ${name}` });
});

//4. Example post request 
app.post("/submit", (req, res) => {
  res.status(201).send("Form submitted!");
});

//5. example running/starting up the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

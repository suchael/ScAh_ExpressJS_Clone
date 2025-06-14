# ScAh_ExpressJS_Clone

> A minimalist Express.js-style web framework built from scratch using Node.js core modules — for educational, experimental, and portfolio purposes.

---

## 👋 Introduction

This project is a personal initiative by **Success Ahmed (ScAh)** (GitHub: [suchael](https://github.com/suchael)) to **rebuild the core behavior of Express.js** — entirely from scratch using just Node.js.

No frameworks or libraries like Express or Fastify were used.

It’s built from scratch to replicate Express.js in order to help further my understanding of:

- How HTTP servers work in Node.js  
- How routing and middleware flow works  
- How web frameworks like Express are structured internally

---

## ✅ What It Can Do (So Far)

1. Create an HTTP server  
2. Define `GET` and `POST` routes  
3. Use middleware (`app.use()`)  
4. Send responses using:
   - `res.send()`
   - `res.status().send()`
   - `res.json()`  
5. Parse query parameters (e.g., `/search?q=hello` → `req.query.q`)  
6. Chain middleware and route handlers like Express  
7. **Parse JSON and urlencoded request bodies via built-in body-parser middleware (use `app.use(app.jsonBodyParser())`)**  
8. **Basic error-handling middleware support (middleware with 4 args: `(err, req, res, next)`)**  

---

## ❌ What It Can’t Do Yet (In Progress)

1. Route parameter parsing (e.g., `/user/:id`)  
2. Support for advanced HTTP methods like `PUT`, `DELETE`, `PATCH`  
3. Routing abstraction (like `Router()`)  
4. Support for templating engines or serving static files  
5. Fully featured error-handling capabilities  
6. Async/await middleware support  

---

## 🚀 Example Usage

```js
const ScAh_ExpressJS_Clone = require("./ScAh_ExpressJS_Clone");

const app = new ScAh_ExpressJS_Clone();

// 1. Built-in JSON body parser middleware
app.use(app.jsonBodyParser());

// 2. Example middleware usage
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 3. GET request example
app.get("/", (req, res) => {
  res.status(200).send("Welcome to ScAh_ExpressJS_Clone!");
});

// 4. GET with query params example
app.get("/hello", (req, res) => {
  const name = req.query.name || "Guest";
  res.json({ message: `Hello, ${name}` });
});

// 5. POST request with body parsing example
app.post("/submit", (req, res) => {
  res.status(201).json({ message: "Form submitted!", receivedBody: req.body });
});

// 6. Error handling middleware example
app.use((err, req, res, next) => {
  console.error("Error caught:", err);
  res.status(500).send("Something went wrong!");
});

// 7. Start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
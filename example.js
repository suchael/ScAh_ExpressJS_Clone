/**
 * Example Usage for ScAh_ExpressJS_Clone
 *
 * HOW TO RUN:
 *step 0: git clone https://github.com/suchael/ScAh_ExpressJS_Clone
 *step 1: npm install (not necessary)
 *step 2: node example.js
 */

// Importing the framework
const ScAh_ExpressJS_Clone = require("./ScAh_ExpressJS_Clone");

// Creating an instance of the app
const app = new ScAh_ExpressJS_Clone();

/**
 * 1. Example showing Middleware usage
 * This middleware logs every incoming request's method and URL.
 */
app.use((req, res, next) => {
  console.log(`\n============\nMiddleWare \nIncoming Request - ${req.method} ${req.url}\n============\n`);
  next(); // Call next middleware or route handler
});


/**
 * 2. Example showing GET route handling with plain text response
 */
app.get("/", (req, res) => {
  res.status(200).send("Home Route "/"");
});


/**
 * 3. Example showing GET route with query string parsing and JSON response
 * Access this using: http://localhost:3000/hello?name=Success%20Ahmed
 */
app.get("/hello", (req, res) => {
  const name = req.query.name || "Guest";
  res.json({ message: `Hello, ${name}` });
});


// 4. Example showing POST route handling
// http://localhost:3000/submit
app.post("/submit", (req, res) => {
  res.status(201).send("Form submitted!");
});


// 5. Start the server
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
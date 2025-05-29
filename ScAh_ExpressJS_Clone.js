// A lightweight web framework inspired by Express.js
// Built from scratch using Node.js core modules
// Author: Success Ahmed (GitHub: suchael) | For Eculis Projects
// Project Name: ScAh_ExpressJS_Clone

const http = require("http");
const URL = require("url");

class ScAh_ExpressJS_Clone {
	constructor() {
		// Stores routes in the format: { 'METHOD /path': handlerFunction }
		this.routes = {};

		// Stores all global middleware functions
		this.middlewareQueue = [];
	}

	/**
	 * Register a global middleware function
	 * @param {Function} middleware - Function with (req, res, next)
	 */
	use(middleware) {
		this.middlewareQueue.push(middleware);
	}

	/**
	 * Define a GET route
	 * @param {string} path 
	 * @param {Function} handler 
	 */
	get(path, handler) {
		this.routes[`GET ${path}`] = handler;
	}

	/**
	 * Define a POST route
	 * @param {string} path 
	 * @param {Function} handler 
	 */
	post(path, handler) {
		this.routes[`POST ${path}`] = handler;
	}

	/**
	 * Start the HTTP server
	 * @param {number} port 
	 * @param {Function} callback 
	 */
	listen(port, callback) {
		const server = http.createServer((req, res) => {
			const { method, url } = req;
			const parsedUrl = URL.parse(url, true); // true = parse query into object

			const routeKey = `${method} ${parsedUrl.pathname}`;
			const routeHandler = this.routes[routeKey];

			// Log current request details
			console.log("Request route key:", routeKey);
			console.log("Raw URL:", url);

			// Attach query object to req, like Express does (e.g., req.query.name)
			req.query = parsedUrl.query;

			// Extend res with status(), send(), and json() methods
			res.statusCode = 200; // default status

			res.status = function (statusCode) {
				this.statusCode = statusCode;
				return this;
			};

			res.send = function (data) {
				this.writeHead(this.statusCode, { "Content-Type": "text/plain" });
				this.end(data);
				return this;
			};

			res.json = function (data) {
				this.writeHead(this.statusCode, { "Content-Type": "application/json" });
				this.end(JSON.stringify(data));
				return this;
			};

			// Execute middleware chain recursively
			const executeMiddlewares = (index) => {
				if (index < this.middlewareQueue.length) {
					const middleware = this.middlewareQueue[index];
					middleware(req, res, () => executeMiddlewares(index + 1));
				} else {
					if (routeHandler) {
						routeHandler(req, res);
					} else {
						// Fallback for unmatched routes
						res.status(404).send("Route not found");
					}
				}
			};

			executeMiddlewares(0);
		});

		server.listen(port, callback);
	}
}

module.exports = ScAh_ExpressJS_Clone;
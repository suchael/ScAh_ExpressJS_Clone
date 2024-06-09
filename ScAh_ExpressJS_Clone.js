const http = require("http");
const { URL } = require("url");

class ScAh_ExpressJS_Clone {
  constructor() {
    // Routes stored as array to preserve order and allow param matching
    this.routes = [];

    // Middlewares with optional path prefix
    // { path, fn }
    this.middlewareQueue = [];
  }

  // Register middleware: app.use(fn) or app.use(path, fn)
  use(pathOrFn, maybeFn) {
    if (typeof pathOrFn === "function") {
      this.middlewareQueue.push({ path: "/", fn: pathOrFn });
    } else if (typeof pathOrFn === "string" && typeof maybeFn === "function") {
      this.middlewareQueue.push({ path: pathOrFn, fn: maybeFn });
    } else {
      throw new Error("Invalid arguments to use()");
    }
  }

  // Register routes
  get(path, handler) {
    this.routes.push({ method: "GET", path, handler });
  }

  post(path, handler) {
    this.routes.push({ method: "POST", path, handler });
  }

  // Match route and extract params
  matchRoute(method, pathname) {
    for (const route of this.routes) {
      if (route.method !== method) continue;

      const routeParts = route.path.split("/").filter(Boolean);
      const urlParts = pathname.split("/").filter(Boolean);

      if (routeParts.length !== urlParts.length) continue;

      let params = {};
      let matched = true;

      for (let i = 0; i < routeParts.length; i++) {
        if (routeParts[i].startsWith(":")) {
          const paramName = routeParts[i].slice(1);
          params[paramName] = decodeURIComponent(urlParts[i]);
        } else if (routeParts[i] !== urlParts[i]) {
          matched = false;
          break;
        }
      }

      if (matched) return { handler: route.handler, params };
    }
    return null;
  }

  // Built-in body parser middleware (JSON + urlencoded)
  jsonBodyParser() {
    return (req, res, next) => {
      const method = req.method.toUpperCase();
      if (method === "POST" || method === "PUT" || method === "PATCH") {
        const contentType = (req.headers["content-type"] || "").toLowerCase();
        const chunks = [];

        req.on("data", chunk => chunks.push(chunk));

        req.on("end", () => {
          const rawBody = Buffer.concat(chunks);
          try {
            if (contentType.includes("application/json")) {
              req.body = rawBody.length ? JSON.parse(rawBody.toString("utf8")) : {};
            } else if (contentType.includes("application/x-www-form-urlencoded")) {
              const parsed = rawBody.toString("utf8").split("&").reduce((acc, pair) => {
                if (!pair) return acc;
                const [key, val] = pair.split("=");
                acc[decodeURIComponent(key)] = decodeURIComponent(val || "");
                return acc;
              }, {});
              req.body = parsed;
            } else {
              req.body = rawBody; // raw Buffer fallback
            }
            next();
          } catch (err) {
            next(err);
          }
        });

        req.on("error", (err) => {
          next(err);
        });
      } else {
        req.body = {};
        next();
      }
    };
  }

  // Extend res object with Express-like helpers
  extendRes(res) {
    res.statusCode = 200;
    res.status = function (code) {
      this.statusCode = code;
      return this;
    };
    res.send = function (data) {
      if (typeof data === "object" && !Buffer.isBuffer(data)) {
        this.setHeader("Content-Type", "application/json");
        this.end(JSON.stringify(data));
      } else if (Buffer.isBuffer(data)) {
        this.setHeader("Content-Type", "application/octet-stream");
        this.end(data);
      } else {
        this.setHeader("Content-Type", "text/plain");
        this.end(data);
      }
      return this;
    };
    res.json = function (obj) {
      this.setHeader("Content-Type", "application/json");
      this.end(JSON.stringify(obj));
      return this;
    };
  }

  // Check if middleware matches request path prefix
  middlewareMatches(mwPath, reqPath) {
    if (mwPath === "/") return true;
    if (!reqPath.startsWith(mwPath)) return false;
    // Ensure matching segment boundaries:
    // e.g. mwPath /api matches /api/users but not /apis
    if (reqPath.length > mwPath.length && reqPath[mwPath.length] !== "/") {
      return false;
    }
    return true;
  }

  listen(port, callback) {
    const server = http.createServer((req, res) => {
      const fullUrl = new URL(req.url, `http://${req.headers.host}`);

      req.query = Object.fromEntries(fullUrl.searchParams.entries());
      req.path = fullUrl.pathname;

      this.extendRes(res);

      const matched = this.matchRoute(req.method, req.path);
      if (matched) req.params = matched.params;
      else req.params = {};

      // Compose middleware + route handler chain:
      // Only add middleware whose path matches req.path
      const middlewares = this.middlewareQueue
        .filter(({ path }) => this.middlewareMatches(path, req.path))
        .map(({ fn }) => fn);

      // Add matched route handler or 404 handler last
      if (matched && matched.handler) {
        middlewares.push(matched.handler);
      } else {
        middlewares.push((req, res) => {
          res.status(404).send("Route not found");
        });
      }

      // Middleware chain executor
      let idx = 0;
      const next = (err) => {
        if (err) {
          // Find next error middleware (fn with 4 args)
          while (idx < middlewares.length) {
            const fn = middlewares[idx++];
            if (fn.length === 4) {
              // error middleware signature (err, req, res, next)
              return fn(err, req, res, next);
            }
          }
          // No error middleware found, send generic error
          res.statusCode = 500;
          return res.end(`Internal Server Error: ${err.message || err}`);
        }

        if (idx >= middlewares.length) return;

        try {
          const fn = middlewares[idx++];
          if (fn.length === 4) {
            // skip error middleware if no error passed
            next();
          } else {
            fn(req, res, next);
          }
        } catch (error) {
          next(error);
        }
      };

      next();
    });

    server.listen(port, callback);
  }
}

module.exports = ScAh_ExpressJS_Clone;
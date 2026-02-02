const express = require("express");
const logger = require("morgan");
const jsonServer = require("json-server");
const url = require("url");
const env = process.env.NODE_ENV || "development";
const { flatten } = require("ramda");

// Initialize JSON Server
console.log("📚 [INIT] Creating JSON Server instance");
const server = jsonServer.create();
const router =
  env === "test"
    ? jsonServer.router("db.test.json")
    : jsonServer.router("db.json");
console.log(`📚 [INIT] Using database: ${env === "test" ? "db.test.json" : "db.json"}`);

const middlewares = jsonServer.defaults();

// Apply middlewares
server.use(middlewares);
server.use(logger("dev"));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

// Load custom routes
console.log("📚 [INIT] Loading custom routes from ./server/routes/");
require("./server/routes/")(server, express);

// Authorization check function
function isAuthorized(req) {
  console.log(`🔐 [AUTH] Checking authorization for ${req.method} ${req.url}`);
  
  if (req.headers.authorization) {
    console.log(`🔐 [AUTH] Authorization header found: ${req.headers.authorization.substring(0, 20)}...`);
    
    const user_and_password = Buffer.from(
      req.headers.authorization.split(" ")[1],
      "base64"
    ).toString();

    const user = user_and_password.split(":")[0];
    const pw = user_and_password.split(":")[1];
    
    console.log(`🔐 [AUTH] User: ${user}, Environment: ${env}`);
    
    const isValid = (
      user === "admin" &&
      ((env === "test" && pw === "admin_test") || pw === "admin")
    );
    
    console.log(`🔐 [AUTH] Authorization result: ${isValid ? "GRANTED" : "DENIED"}`);
    return isValid;
  } else {
    console.log(`🔐 [AUTH] No authorization header found - DENIED`);
    return false;
  }
}

// Check if policy routes need authentication (DELETE/PUT operations)
const policyRouteNeedsAuth = (req) => {
  const needsAuth = req.url.match(/policies/) && (req.method === "DELETE" || req.method === "PUT");
  if (needsAuth) console.log(`🔒 [ROUTE] Policy route requires auth: ${req.method} ${req.url}`);
  return needsAuth;
};

// Check if user routes need authentication (DELETE operations)
const userRouteNeedsAuth = (req) => {
  const needsAuth = req.url.match(/users/) && req.method === "DELETE";
  if (needsAuth) console.log(`🔒 [ROUTE] User route requires auth: ${req.method} ${req.url}`);
  return needsAuth;
};

// Authentication middleware
server.use((req, res, next) => {
  console.log(`🌐 [MIDDLEWARE] Auth check for ${req.method} ${req.url}`);
  
  if (
    (policyRouteNeedsAuth(req) || userRouteNeedsAuth(req)) &&
    !isAuthorized(req)
  ) {
    console.log(`❌ [RESPONSE] Sending 401 Unauthorized for ${req.method} ${req.url}`);
    res.sendStatus(401);
  } else {
    console.log(`✅ [MIDDLEWARE] Auth passed, proceeding to next middleware`);
    next();
  }
});

// Request processing middleware
server.use((req, res, next) => {
  console.log(`🔄 [MIDDLEWARE] Processing ${req.method} request to ${req.path}`);
  console.log(`📥 [INPUT] Headers:`, JSON.stringify(req.headers, null, 2));
  console.log(`📥 [INPUT] Body:`, JSON.stringify(req.body, null, 2));
  console.log(`📥 [INPUT] Query:`, JSON.stringify(req.query, null, 2));
  
  if (req.method === "POST") {
    console.log(`📝 [POST] Processing POST request`);
    
    // Validate customer_id exists for POST requests
    if ((req.path === "/polcies" || req.path === "/policies/") && !req.body.customer_id) {
      console.log(`❌ [VALIDATION] Customer ID is required for policy creation`);
      console.log(`📤 [RESPONSE] Sending 500 error: Customer ID cannot be null`);
      res.status(500).send({ error: "Customer ID cannot be null" });
      return;
    }
    next();
  } else if (req.method === "PUT") {
    console.log(`✏️ [PUT] Converting PUT to PATCH`);
    req.method = "PATCH";
    next();
  } else {
    console.log(`➡️ [MIDDLEWARE] Passing through ${req.method} request`);
    next();
  }
});

// Helper function to construct full URL
function fullUrl(req) {
  const fullURL = url.format({
    protocol: req.protocol,
    host: req.get("host"),
    pathname: req.originalUrl,
  });
  console.log(`🔗 [URL] Constructed full URL: ${fullURL}`);
  return fullURL;
}

// Custom render function for JSON Server responses
router.render = (req, res) => {
  console.log(`🎨 [RENDER] Rendering response for ${req.method} ${req.url}`);
  console.log(`📤 [RESPONSE] Data:`, JSON.stringify(res.locals.data, null, 2));
  
  if (req.method === "DELETE") {
    console.log(`🗑️ [DELETE] Setting 204 No Content status for DELETE operation`);
    res.status(204);
  }
  
  console.log(`📤 [RESPONSE] Sending JSON response`);
  res.jsonp(res.locals.data);
};


// Custom search endpoint for policies
server.get("/policies/search", (req, res) => {
  console.log(`🔍 [SEARCH] Policy search API called`);
  console.log(`📥 [INPUT] Search parameters:`, JSON.stringify(req.query, null, 2));
  
  const db = router.db;
  console.log(`💾 [DATABASE] Accessing policies collection`);

const policies = db
  .get("policies")
  .filter((r) => {
    const policyIdMatch = req.query.policy_id
      ? r.policy_id === Number(req.query.policy_id)
      : true;

    const customerIdMatch = req.query.customer_id
      ? r.customer_id === Number(req.query.customer_id)
      : true;

    return policyIdMatch && customerIdMatch;
  })
  .value();

  console.log(`🔍 [SEARCH] Found ${policies.length} matching policies`);
  console.log(`📤 [RESPONSE] Sending search results:`, JSON.stringify(policies, null, 2));
  res.status(200).send(policies);
});

// Apply JSON Server router for default CRUD operations
console.log(`🔧 [INIT] Applying JSON Server router for CRUD operations`);
server.use(router);

// Catch-all route for 404 errors
server.get("*", (req, res) => {
  console.log(`❌ [404] Route not found: ${req.method} ${req.url}`);
  console.log(`📤 [RESPONSE] Sending 404 Not Found`);
  res.status(404).send();
});

// Start the server
const PORT = process.env.PORT || 80;
server.listen(PORT, () => {
  console.log(`🚀 [SERVER] Server running on port: ${PORT}`);
  console.log(`🌐 [SERVER] Environment: ${env}`);
  console.log(`📚 [SERVER] Policies API is ready!`);
});

module.exports = server;

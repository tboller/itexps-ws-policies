const path = require("path");

// API Token validation middleware
const apiToken = (req, res, next) => {
  console.log(`🔑 [TOKEN] Checking API token for ${req.method} ${req.url}`);
  
  const token = req.get("G-TOKEN");
  console.log(`🔑 [TOKEN] Received token: ${token ? token.substring(0, 5) + '...' : 'None'}`);
  
  if (token === "ITEXPS") {
    console.log(`✅ [TOKEN] Valid token - access granted`);
    next();
  } else {
    console.log(`❌ [TOKEN] Invalid token - access denied`);
    console.log(`📤 [RESPONSE] Sending 403 Forbidden`);
    res.status(403).end();
  }
};

module.exports = (app) => {
  console.log(`🛣️ [ROUTES] Setting up custom routes`);
  
  // UI route - serves the main interface
  app.get("/ui", (req, res) => {
    console.log(`🖥️ [UI] Serving UI page for ${req.method} ${req.url}`);
    console.log(`📁 [FILE] Sending index.html`);
    res.sendFile(path.join(__dirname, "../", "index.html"));
  });

  // Landing page route
  app.get("/landing", (req, res) => {
    console.log(`🏠 [LANDING] Serving landing page for ${req.method} ${req.url}`);
    console.log(`📁 [FILE] Sending landing.html`);
    res.sendFile(path.join(__dirname, "../", "landing.html"));
  });

  // Apply API token middleware to all subsequent routes
  console.log(`🔒 [MIDDLEWARE] Applying API token validation to all routes`);
  app.use(apiToken);

};
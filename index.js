const express = require("express");
const app = express();
const port = 3000;
const policiesRouter = require("./routes/policies");
const claimsRouter = require("./routes/claims");
const coveragesRouter = require("./routes/coverages");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

//Base route that simply displays messsage of 'ok'
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

/* Routers */
app.use("/policies", policiesRouter);
app.use("/claims", claimsRouter);
app.use("/coverages", coveragesRouter);

/* Error handler middleware */
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   console.error(err.message, err.stack);
//   res.status(statusCode).json({ message: err.message });
//   return;
// });
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (err.payload) {
    return res.status(statusCode).json(err.payload);
  }

  res.status(statusCode).json({
    timestamp: new Date().toISOString(),
    status: statusCode,
    error: "Internal Server Error",
    message: err.message,
    path: req.originalUrl,
  });
});

app.listen(port, () => {
  console.log(`Insurance API listening at http://localhost:${port}`);
});

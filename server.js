const express = require("express");
const morgan = require("morgan");
require("dotenv").config();

require("express-async-errors");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// middleware
app.use(morgan("dev"));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(400).json({ error: err.message });
  next(err);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}...`);
});

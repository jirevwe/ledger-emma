require("dotenv").config();

require("express-async-errors");
const http = require("http");

const express = require("express");

const app = express();
const accountRouter = require("./routes/accounts");
const transfersRouter = require("./routes/transfers");

// database
const connectDB = require("./db/index");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.send("Ledger");
});

app.use("/api/v1/accounts", accountRouter);

app.use("/api/v1/transfers", transfersRouter);

// middleware

app.use(notFoundMiddleware);

app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    const server = http.createServer(app);
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();

const express = require("express");
const { rootRouter } = require("./routes/index");
const authMiddleware = require("./middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.use("/api/v1", rootRouter);

app.listen(3000, console.log("server started"));

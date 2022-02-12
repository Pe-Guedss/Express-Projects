const express = require("express");
const app = express ();

app.use (express.json());

const createRouter = require("./routes/create");
const deleteRouter = require("./routes/delete");
const readRouter = require("./routes/read");
const updateRouter = require("./routes/update");

app.use("/create", createRouter);
app.use("/delete", deleteRouter);
app.use("/read", readRouter);
app.use("/update", updateRouter);

app.listen (3000, () => {
    console.log("Server started on port 3000.");
});
const express = require('express');
const app = express ();
var dataBase = require("./data/dataBase");

app.use (express.json());

console.log(dataBase);

// app.get("/select")

app.listen (3000, () => {
    console.log("Server started on port 3000.");
});
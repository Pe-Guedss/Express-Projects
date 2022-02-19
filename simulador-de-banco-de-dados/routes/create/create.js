const router = require("express").Router();
const path = require("path");

var dataBase = require("../../data/dataBase");

router.get("/", (req, res)=> {
    res.sendFile(path.join(__dirname, "index.html"));
});

module.exports = router;
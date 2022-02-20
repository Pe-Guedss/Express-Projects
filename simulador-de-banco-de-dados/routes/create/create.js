const router = require("express").Router();
const path = require("path");

var dataBase = require("../../data/dataBase");

router.get("/", (req, res)=> {
    res.sendFile(path.join(__dirname, "index.html"));
});

router.post("/new_table/:tableName", (req, res) => {
    const { tableName } = req.params;

    dataBase[tableName] = {};

    res.status(200).send(dataBase);
});

router.post("/insert/:tableName", (req, res) => {
    const { tableName } = req.params;
    const { elementId, properties } = req.body;

    if (!elementId || !properties) {
        res.status(500).send("Bad Request! Either 'elementID' or 'properties' are missing of misspelled.")
    }
    else if (!dataBase[tableName]) {
        res.status(404).send("Table not found!")
    }
    else {
        dataBase[tableName][elementId] = properties;
        res.status(200).send(dataBase[tableName])
    }
});

module.exports = router;
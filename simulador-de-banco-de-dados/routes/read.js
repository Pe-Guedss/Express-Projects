const router = require('express').Router();

var dataBase = require("../data/dataBase");

router.get('/', (req, res)=> {
    res.send("Implementar rota READ!")
});

module.exports = router;
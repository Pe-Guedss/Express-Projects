const router = require('express').Router();

const { lojaDeJogos } = require('../data/dataBase');
var dataBase = require("../data/dataBase");

router.delete("/delete_all", (req, res)=> {
    
    for(var item in dataBase.lojaDeJogos){
         dataBase.lojaDeJogos = {};
    }
    res.send("Implementar rota DELETE!")
});

router.delete("/:tableName", (req, res)=> {
    
    const { tableName } = req.params;
    delete dataBase.lojaDeJogos[tableName];
   
    res.send("Implementar rota DELETE!")
});

module.exports = router;
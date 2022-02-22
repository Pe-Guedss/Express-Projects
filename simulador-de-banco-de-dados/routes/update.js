const router = require('express').Router();

var dataBase = require("../data/dataBase");

router.get('/', (req, res)=> {
    res.send("Implementar rota UPDATE!")
});

router.put('/:tableName/:id', (req, res)=> {
    const {tableName, id} = req.params; 
    const jogo = dataBase[tableName][id];
    const body = req.body;
    if(jogo){
        dataBase[tableName][id].nome = body.nome||jogo.nome;
        dataBase[tableName][id].ano = body.ano||jogo.ano;
        dataBase[tableName][id].preco = body.preco||jogo.preco;
        dataBase[tableName][id].genero = body.genero||jogo.genero;
    
        res.json(dataBase[tableName]);
    }else{
        res.status(404).send("Game not found!");
    }
    
});

module.exports = router;
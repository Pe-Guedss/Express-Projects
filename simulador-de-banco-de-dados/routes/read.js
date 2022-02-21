const router = require('express').Router();

const res = require('express/lib/response');
var dataBase = require("../data/dataBase");

router.get('/', (req, res)=> {
    res.send(dataBase.lojaDeJogos)
});

router.get('/:jogo', (req, res) =>{
    const Jogo = req.params.jogo;
    res.send(dataBase.lojaDeJogos[Jogo]);
})

router.get('/:jogo/:propriedade' , (req, res) => {
    const {jogo, propriedade} = req.params;
    res.send(dataBase.lojaDeJogos[jogo][propriedade]);
})

module.exports = router;
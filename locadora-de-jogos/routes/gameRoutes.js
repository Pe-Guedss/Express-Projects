const express = require('express');
const router = express.Router();

// Constantes para manejamento de excessões
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');

const Jogos = require('../models/Jogo');

router.use(express.json());

// Rotas CREATE
router.post('/create', asyncHandler(async (req, res, next) => {
    try{
        const jogo = req.body;
        let count = 0;
        const attributes = Jogos.getAttributes();
        for(let property in jogo){
            if(!attributes[property]){
                count++;
            }
        }
        if(count == 0 && jogo.IdUsuario!=null){
            await Jogos.create(jogo);
            res.status(200).send(jogo);
        }
        else{
            res.status(404).send('Some property sended in the body was not found');
        }
    }
    catch{
        next(createError(500, `An error ocurred when trying to create a game. Error -> ${error}`));
        return;
    }
}));


// Rotas READ
router.get('/', async (req, res) => {
    res.status(404).send('Implementar rota READ.')
});


// Rotas UPDATE
router.put('/', async (req, res) => {
    res.status(404).send('Implementar rota UPDATE.')
});


// Rotas DELETE
router.delete('/', async (req, res) => {
    res.status(404).send('Implementar rota DELETE.')
});



router.use((error, req, res, next) => {
    // Seta o HTTP Status Code
    res.status(error.status || 500);
  
    // Envia a resposta
    res.json({
        status: error.status,
        message: error.message
    })
});

module.exports = router

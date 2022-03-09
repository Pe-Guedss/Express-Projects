const express = require('express');
const router = express.Router();

// Constantes para manejamento de excessões
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');

const Jogos = require('../models/Jogo');

router.use(express.json());

// Rotas CREATE
router.post('/', async (req, res) => {
    res.status(404).send('Implementar rota POST.')
});


// Rotas READ
router.get('/', async (req, res) => {
    res.status(404).send('Implementar rota READ.')
});


// Rotas UPDATE
router.put('/', async (req, res) => {
    res.status(404).send('Implementar rota UPDATE.')
});


// Rotas DELETE
router.delete('/delete_all/', asyncHandler (async (req, res, next) => {
    try {
        const games = await Jogos.findAll();
        games.destroy();
        res.status(200).json(games);
    }
    catch (error) {
        next(createError(500, 'An error ocurred when trying to delete all data from the table "Jogos".', error));
        return;
    }
}));

router.delete('/delete/by_pk/:pk', asyncHandler (async (req, res, next) => {
    const { pk } = req.params
    try {
        const game = await Jogos.findByPk(pk);
        game.destroy();
        res.status(200).json(game);
    }
    catch (error) {
        next(createError(500, `An error ocurred when trying to delete the game with Primary key: ${pk}.`, error));
        return;
    }
}));



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

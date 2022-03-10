const express = require('express');
const router = express.Router();

// Constantes para manejamento de excessões
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');

const Jogos = require('../models/Jogo');

router.use(express.json());

// Rotas CREATE
router.post('/', async (req, res) => {
    res.status(404).send('Implementar rota POST.');
});


// Rotas READ
router.get('/read_all/', asyncHandler (async (req, res, next) => {
    try {
        const games = await Jogos.findAll();
        res.status(200).json(games);
    }
    catch (error) {
        next(createError(500, 'An error ocurred when trying to retrieve all data from the table "Jogos".', error));
        return;
    }
}));

router.get('/read/by_id/:id', asyncHandler (async (req, res, next) => {
    const { id } = req.params
    try {
        const game = await Jogos.findByPk(id);
        res.status(200).json(game);
    }
    catch (error) {
        next(createError(500, `An error ocurred when trying get the game with Primary key: ${id}.`, error));
        return;
    }
}));

function validateReadRequest (game, id) {
    try {
        if ( !/^\d+$/.test(id) ) {
            return {status: 400,
                    message: `Game ID: ${id} is invalid!`
                };
        }
        if (!game) {
            return {status: 404,
                    message: `Game with ID: ${id} was not found!`
                };
        }
        return {status: 200,
                message: ''
            };
    }
    catch {
        return {status: 500,
                message: `An internal error occurred when validating the data from Game with ID: ${id}!`
            };
    }
}


// Rotas UPDATE
router.put('/', async (req, res) => {
    res.status(404).send('Implementar rota UPDATE.');
});


// Rotas DELETE
router.delete('/', async (req, res) => {
    res.status(404).send('Implementar rota DELETE.');
});



router.use((error, req, res, next) => {
    // Seta o HTTP Status Code
    res.status(error.status || 500);
  
    // Envia a resposta
    res.json({
        status: error.status,
        message: error.message
    });
});

module.exports = router;

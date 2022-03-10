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
        for (const jogo of games) {
        jogo.destroy();
    }
        res.status(200).json(games);
    }
    catch (error) {
        next(createError(500, 'An error ocurred when trying to delete all data from the table "Jogos".', error));
        return;
    }
}));

router.delete('/delete/by_id/:id', asyncHandler (async (req, res, next) => {
    const { id } = req.params
    try {
        const game = await Jogos.findByPk(id);
        
        const { status, message } = validateDeleteRequest(game, id);
        if (status != 200) {
            next(createError(status, message));
            return;
        }
        game.destroy();
        res.status(status).json(game);


    }
    catch (error) {
        next(createError(500, `An error ocurred when trying to delete the game with Primary key: ${id}. Error -> ${error}`));
        return;
    }
}));

function validateDeleteRequest (game, id) {
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

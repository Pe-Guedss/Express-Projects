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
router.get('/read_all/', asyncHandler (async (req, res, next) => {
    try {
        const games = await Jogos.findAll();
        res.status(200).json(games);
    }
    catch (error) {
        next(createError(500, `An error ocurred when trying to retrieve all data from the table: Jogos. Error -> ${error}`));
        return;
    }
}));

router.get('/read/by_id/:id', asyncHandler (async (req, res, next) => {
    const { id } = req.params
    try {
        const game = await Jogos.findByPk(id);

        const { status, message } = validateReadRequest(game, id);
        if (status != 200) {
            next(createError(status, message));
            return;
        }

        res.status(200).json(game);
    }
    catch (error) {
        next(createError(500, `An error ocurred when trying get the game with Primary key: ${id}. Error -> ${error}`));
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
router.put('/update/by_id/:id', asyncHandler(async(req,res) =>{
    const id = req.params.id;
    const body = req.body;
    try{
        const jogo = await Jogos.findByPk(id);
        if(Object.keys(body).length === 0 ){
            res.status(404).send("There is nothing in the body to be updated");
            return;
        }
        if(!jogo){
            res.status(404).send(`There is no game with id number ${id}`);
            return;
        }
        for(let property in body){
            if(!jogo[property]){
                res.status(404).send(`Property called ${property} was not found`);
                return;
            }   
            jogo[property] = body[property];
        }
        jogo.save();
        res.status(200).send('Everything was updated successfully');
    }catch(error){
        next(createError(500,`An error ocurred when trying to update the data from the table: jogos. Error -> ${error}`));
    }
}));


// Rotas DELETE
router.delete('/delete_all/', asyncHandler (async (req, res, next) => {
    try {
        const games = await Jogos.findAll();
        for (const game of games) {
            game.destroy();
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

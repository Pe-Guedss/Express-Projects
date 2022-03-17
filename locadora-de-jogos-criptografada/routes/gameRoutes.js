const express = require('express');
const router = express.Router();

// Constantes para manejamento de excessões
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');

const Jogos = require('../models/Jogo');
const Usuarios = require('../models/Usuario')

const bcrypt = require('bcrypt');

router.use(express.json());

const authenticateRequest = async (req, res, next) => {

    try {
        const { creds } = req.body;
        if (!creds) {
            next(createError(400, 'Bad Request: this request body requires a creds property containing the user data to login'));
            return;
        }

        const { email, senha } = creds;
        if(!email || !senha){
            next(createError(400, 'Bad Request: either email or senha are missing in the request body'));
            return;
        }

        const users = await Usuarios.findAll({where: {
            email: email
        }});
        if (users.length === 0) {
            next(createError(404, 'Not Found: there was no matches in our database for the informed email credential. Please consider signing in'));
            return;
        }

        const dataBaseSenha = users[0].dataValues.senha;
        const autenticacao = await bcrypt.compare(senha, dataBaseSenha);
        if(autenticacao){
            next()
            return;
        }
        else{
            res.status(400).send("Wrong password!");
            return;
        }
    } 
    catch (err) {
        next(err);
        return;
    }
}

// Rotas CREATE
router.post('/create', asyncHandler(authenticateRequest), asyncHandler(async (req, res, next) => {
    try{
        const jogo = req.body;
        const attributes = Jogos.getAttributes();
        for(let property in jogo){
            if(!attributes[property] && property !== "creds"){
                next(createError(400, 'Some property sended in the request body was not found'));
                return;
            }
        }
        await Jogos.create(jogo);
        res.status(200).send(jogo);
    }
    catch(error){
        next(createError(500, `An error ocurred when trying to create a game. Error -> ${error}`));
        return;
    }
}));


// Rotas READ
router.get('/read_all/', asyncHandler(authenticateRequest), asyncHandler (async (req, res, next) => {
    try {
        const games = await Jogos.findAll();
        res.status(200).json(games);
    }
    catch (error) {
        next(createError(500, `An error ocurred when trying to retrieve all data from the table: Jogos. Error -> ${error}`));
        return;
    }
}));

router.get('/read/by_id/:id', asyncHandler(authenticateRequest), asyncHandler (async (req, res, next) => {
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
router.put('/update/by_id/:id', asyncHandler(authenticateRequest), asyncHandler(async(req,res) =>{
    const id = req.params.id;
    const body = req.body;
    try{
        const jogo = await Jogos.findByPk(id);
        if(Object.keys(body).length === 0 ){
            next(createError(400, 'There is nothing in the body to be updated'));
            return;
        }
        if(!jogo){
            next(createError(404, `There is no game with id number ${id}`));
            return;
        }
        for(let property in body){
            if(!jogo[property] && property !== "creds"){
                next(createError(404, `Property called ${property} was not found`));
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
router.delete('/delete_all/', asyncHandler(authenticateRequest), asyncHandler (async (req, res, next) => {
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

router.delete('/delete/by_id/:id', asyncHandler(authenticateRequest), asyncHandler (async (req, res, next) => {
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
    });
});

module.exports = router;

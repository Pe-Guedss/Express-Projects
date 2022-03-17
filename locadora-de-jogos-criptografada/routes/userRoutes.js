const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// Constantes para manejamento de excessões
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');

const Usuarios = require('../models/Usuario');

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
            next(createError(400, 'Wrong password'));
            return;
        }
    } 
    catch (err) {
        next(createError(500, `An error ocurred when trying to authenticate the login. Please try again later. Error -> ${err}`));
        return;
    }
}

// Rotas CREATE
router.post('/create', asyncHandler(async (req, res, next) => {
    try{
        const usuario = req.body;
        const attributes = Usuarios.getAttributes();
        for(let property in usuario){
            if( !attributes[property] ){
                next(createError(404, 'Some property sended in the body was not found'));
                return;
            }
        }
        const users = await Usuarios.findAll({where: {
            email: usuario.email
        }});
        if(users.length === 0){
            usuario.senha = await bcrypt.hash(usuario.senha, 10);
            await Usuarios.create(usuario);
            res.status(200).send(usuario);
        }
        else{
            next(createError(400, 'User already registered. Try another email'));
            return;
        }
    }   
    catch(error){
        next(createError(500, `An error ocurred when trying to create a user. Error -> ${error}`));
        return;
    }
}));


// Rotas READ
router.get('/read_all/', asyncHandler(authenticateRequest), asyncHandler (async (req, res, next) => {
    try {
        const users = await Usuarios.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        next(createError(500, `An error ocurred when trying to retrieve all data from the table: Usuarios. Error -> ${error}`));
        return;
    }
}));

router.get('/read/by_id/:id', asyncHandler(authenticateRequest), asyncHandler (async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await Usuarios.findByPk(id);

        const { status, message } = validateReadRequest(user, id);
        if (status != 200) {
            next(createError(status, message));
            return;
        }

        res.status(status).json(user);
    }
    catch (error) {
        next(createError(500, `An error ocurred when trying get the user with Primary key: ${id}. Error -> ${error}`));
        return;
    }
}));

function validateReadRequest (user, id) {
    try {
        if ( !/^\d+$/.test(id) ) {
            return {status: 400,
                    message: `User ID: ${id} is invalid!`
                };
        }
        if (!user) {
            return {status: 404,
                    message: `User with ID: ${id} was not found!`
                };
        }
        return {status: 200,
                message: ''
            };
    }
    catch {
        return {status: 500,
                message: `An internal error occurred when validating the data from user with ID: ${id}!`
            };
    }
}


// Rotas UPDATE

router.put('/update/by_id/:id', asyncHandler(authenticateRequest), asyncHandler(async(req,res,next) =>{
    const id = req.params.id;
    const body = req.body;
    try {
        const usuario = await Usuarios.findByPk(id);
        if(Object.keys(body).length === 0){
            next(createError(400, 'There is nothing in the body to be updated'));
            return;
        }
        if(!usuario){
            next(createError(404, `There is no user with id number ${id}`));
            return;
        }
        if(body.creds.email !== usuario.email){
            next(createError(401, 'You are not allowed to change the user with this ID'));
            return;
        }
        for(let property in body){
            if( Object.keys(usuario.dataValues).indexOf(property) === -1 ){
                if (property !== "creds") {
                    console.log(jogo);
                    next(createError(404, `Property called ${property} was not found`));
                    return;
                }
                continue;
            }   
            if(property!="senha"){
                usuario[property] = body[property];
            }  
            else{
                usuario[property] = await bcrypt.hash(body.senha, 10);
            }
        }
        usuario.save();
        res.status(200).send('Everything was updated successfully');   
    }
    catch(error) {
        next(createError(500,`An error ocurred when trying to update the data from the table: Usuarios. Error -> ${error}`));
    }
}));


// Rotas DELETE
router.delete('/delete_all/', asyncHandler(authenticateRequest), asyncHandler (async (req, res, next) => {
    try {
        const users = await Usuarios.findAll();
        for (const user of users) {
            user.destroy();
        }
        res.status(200).json(users);
    }
    catch (error) {
        next(createError(500, 'An error ocurred when trying to delete all data from the table "Usuarios".', error));
        return;
    }
}));

router.delete('/delete/by_id/:id', asyncHandler(authenticateRequest), asyncHandler (async (req, res, next) => {
    const { id } = req.params
    try {
        const user = await Usuarios.findByPk(id);
        
        const { status, message } = validateDeleteRequest(user, id);
        if (status != 200) {
            next(createError(status, message));
            return;
        }
        user.destroy();
        res.status(status).json(user);
    }
    catch (error) {
        next(createError(500, `An error ocurred when trying to delete the user with Primary key: ${id}. Error -> ${error}`));
        return;
    }
}));

function validateDeleteRequest (user, id) {
    try {
        if ( !/^\d+$/.test(id) ) {
            return {status: 400,
                    message: `User ID: ${id} is invalid!`
                };
        }
        if (!user) {
            return {status: 404,
                    message: `User with ID: ${id} was not found!`
                };
        }
        return {status: 200,
                message: ''
            };
    }
    catch {
        return {status: 500,
                message: `An internal error occurred when validating the data from user with ID: ${id}!`
            };
    }
}


// Error Middleware
router.use((error, req, res, next) => {
    // Seta o HTTP Status Code
    res.status(error.status || 500);
  
    // Envia a resposta
    res.json({
        status: error.status,
        message: error.message
    })
});

module.exports = router;

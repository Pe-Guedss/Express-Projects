const express = require('express');
const router = express.Router();

// Constantes para manejamento de excessões
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');

const Usuarios = require('../models/Usuario');

router.use(express.json());

// Rotas CREATE
router.post('/create', asyncHandler(async (req, res, next) => {
    try{
        const usuario = req.body;
        const attributes = Usuarios.getAttributes();
        for(let property in usuario){
            if(!attributes[property]){
                next(createError(404, 'Some property sended in the body was not found'));
                return;
            }
        }
        await Usuarios.create(usuario);
        res.status(200).send(usuario);
    }
    catch(error){
        next(createError(500, `An error ocurred when trying to create a user. Error -> ${error}`));
        return;
    }
}));


// Rotas READ
router.get('/read_all/', asyncHandler (async (req, res, next) => {
    try {
        const users = await Usuarios.findAll();
        res.status(200).json(users);
    }
    catch (error) {
        next(createError(500, `An error ocurred when trying to retrieve all data from the table: Usuarios. Error -> ${error}`));
        return;
    }
}));

router.get('/read/by_id/:id', asyncHandler (async (req, res, next) => {
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

router.put('/update/by_id/:id', asyncHandler(async(req,res,next) =>{
    const id = req.params.id;
    const body = req.body;
    try{
        const usuario = await Usuarios.findByPk(id);
        if(Object.keys(body).length === 0 ){
            next(createError(404, 'There is nothing in the body to be updated'));
            return;
        }
        if(!usuario){
            next(createError(404, `There is no user with id number ${id}`));
            return;
        }
        for(let property in body){
            if(!usuario[property]){
                next(createError(404, `Property called ${property} was not found`));
                return;
            }   
            usuario[property] = body[property];
        }
        usuario.save();
        res.status(200).send('Everything was updated successfully');
    }catch(error){
        next(createError(500,`An error ocurred when trying to update the data from the table: Usuarios. Error -> ${error}`));
    }

    
    
}));


// Rotas DELETE
router.delete('/delete_all/', asyncHandler (async (req, res, next) => {
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

router.delete('/delete/by_id/:id', asyncHandler (async (req, res, next) => {
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

const express = require('express');
const router = express.Router();

// Constantes para manejamento de excessões
const asyncHandler = require('express-async-handler');
const createError = require('http-errors');

const Usuarios = require('../models/Usuario');

router.use(express.json());

// Rotas CREATE
router.post('/', async (req, res) => {
    const body = req.body;
    const usuario = {
        nome: body.nome,
        email: body.email,
        senha: body.senha
    }
    await Usuarios.create(usuario);
    res.status(200).send(usuario);
});


// Rotas READ
router.get('/', async (req, res) => {
    res.status(404).send('Implementar rota READ.')
});


// Rotas UPDATE
router.put('/update/by_id/:id', async(req,res) =>{
    const id = req.params.id;
    const body = req.body;
    const usuario = await Usuarios.findByPk(id);
    if(Object.keys(body).length === 0 ){
        res.status(404).send("there's nothing in the body to be updated");
        return;
    }
    if(!usuario){
        res.status(404).send(`there's no user with id number ${id}`);
        return;
    }
    for(let property in body){
        if(!usuario[property]){
            res.status(404).send(`Property called ${property} was not found`);
            return;
        }   
        usuario[property] = body[property];
    }
    usuario.save();
    res.status(200).send('everthing was update sucessfuly');
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

module.exports = router;
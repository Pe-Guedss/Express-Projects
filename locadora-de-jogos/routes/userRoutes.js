const express = require('express');
const router = express.Router();
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
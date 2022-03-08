const express = require("express");
const router = express.Router();
const Usuario = require('../models/Usuario');

router.use(express.json());

router.post("/",  async (req, res)=> {
    const body = req.body;
    const usuario = {
        nome: body.nome,
        email: body.email,
        senha: body.senha
    }
   await Usuario.create(usuario);
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
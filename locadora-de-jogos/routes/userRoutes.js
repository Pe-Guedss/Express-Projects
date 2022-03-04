const express = require("express");
const router = require('express').Router();
const Usuario = require('../models/Usuario');

router.post("/",  async (req, res)=> {
    const body = req.body;
    const usuario = {
        nome: body.nome,
        email: body.email,
        senha: body.senha
    }
   await Usuario.create(usuario);
});

module.exports = router;
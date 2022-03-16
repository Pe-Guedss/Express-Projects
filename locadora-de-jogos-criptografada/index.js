const express = require('express');
const app = express ();

const bcrypt = require('bcrypt');

const asyncHandler = require('express-async-handler');
const createError = require('http-errors');

app.use (express.json());
app.use (express.urlencoded({
    extended: false,
}));

const Usuarios = require('./models/Usuario'); 

app.use(asyncHandler (async (req, res, next) => {

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
            next(createError(404, 'Not Found: there was no matches in our database for the informed credentials. Please consider signing in'));
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
}));

const userRouter = require('./routes/userRoutes');
const gameRouter = require('./routes/gameRoutes');

app.use('/users', userRouter);
app.use('/games', gameRouter);

app.use((error, req, res, next) => {
    // Seta o HTTP Status Code
    res.status(error.status || 500);
  
    // Envia a resposta
    res.json({
        status: error.status,
        message: error.message
    })
});

app.listen (3000, () => {
    console.log('Server started on port 3000.');
});

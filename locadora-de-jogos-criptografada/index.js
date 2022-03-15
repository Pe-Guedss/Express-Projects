const express = require('express');
const app = express ();
const bcrypt = require('bcrypt');

app.use (express.json());
app.use (express.urlencoded({
    extended: false,
}));

const Usuarios = require('./models/Usuario'); 

app.use(async (req, res, next) => {

    try {
        const { creds } = req.body;
        if(!creds){
            next()
            return;
        }
        const { email, senha } = creds;

        const users = await Usuarios.findAll({where: {
            email: email
        }});

        if (users.length === 0) {
            res.status(404).send("User not found.");
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
});

const userRouter = require('./routes/userRoutes');
const gameRouter = require('./routes/gameRoutes');

app.use('/users', userRouter);
app.use('/games', gameRouter);


app.listen (3000, () => {
    console.log('Server started on port 3000.');
});

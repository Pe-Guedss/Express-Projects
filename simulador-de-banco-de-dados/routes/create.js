const router = require("express").Router();

var dataBase = require("../data/dataBase");

router.get("/", (req, res)=> {
    res.send(`Bem vindo(a) à rota CREATE!
    \n\n
    Por enquanto, as requests permitidas são:\n
     - https://localhost/create/nome_db\n
     - https://localhost/create/insert/nome_db
     \n\n
    Ambas são do tipo POST, sendo que a segunda necessita de um objeto JSON a ser inserido na base de dados.`);
});

module.exports = router;
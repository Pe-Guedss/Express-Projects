const router = require('express').Router();

const res = require('express/lib/response');
var dataBase = require("../data/dataBase");

router.get('/', (req, res)=> {
    res.send(dataBase)
});

router.get('/:tableName', (req, res) =>{
    const { tableName } = req.params;
    if(!dataBase[tableName]){
        res.status(404).send(`Table called ${tableName} Not Found`);
    }
    else{
        res.send(dataBase[tableName]);
    }
});

router.get('/:tableName/:id', (req, res) =>{
    const { tableName, id} = req.params;
    if(!dataBase[tableName][id]){
        res.status(404).send(`${id} Not Found`);
    }
    else{
        res.send(dataBase[tableName][id]);
    }
})

router.get('/:tableName/:id/:property' , (req, res) => {
    const { tableName, id, property} = req.params;
    if(!dataBase[tableName][id][property]){
        res.status(404).send(`${id}'s Property Called ${property} Not Found`);
    }
    else{
        res.send(dataBase[tableName][id][property]);
    }
})

module.exports = router;
const router = require('express').Router();

var dataBase = require("../data/dataBase");


// para varias propriedades de varios ids que estão em uma loja especifica
router.put('/:tableName', (req, res)=> {
    //enviar um json 
    const tableName = req.params.tableName; 
    const body = req.body;
    console.log(body);
    if(!dataBase[tableName]){
        res.status(404).send(`${tableName} not found!`);
    }
    else{
        for( const id in body){
            if(!dataBase[tableName][id]){
                res.status(404).send(`${id} not found!`);
            }
            else{
                for(let property in body[id]){
                    if(!dataBase[tableName][id][property]){
                        delete body[id][property];
                    }
                }
            }
        }
        for( let id in body){
            console.log(id)

            for(let property in body[id]){
                dataBase[tableName][id][property] = body[id][property];
                res.status(200).send(`everthing was updated sucessfuly`)
                
            }
        }
    }
});

// Para varias propriedades de um id dentro de uma loja especifica
router.put('/:tableName/:id', (req, res)=> {
    const {tableName, id} = req.params; 
    const body = req.body;
    if(!dataBase[tableName][id]){
        res.status(404).send(`${id} not found!`);
    }
    else{
        for(let property in body){
            if(!dataBase[tableName][id][property]){
                res.status(404).send(`property called ${property} not found`);
            }
        }
        for(let property in body){
           dataBase[tableName][id][property] = body[property]; 
        }
        res.status(200).send(`${id}  was  updated successfully`)
    }
    
});

// Para uma propriedade, de um id que esta dentro de uma loja especifica
router.put('/:tableName/:id/:property', (req, res) => {
    const {tableName, id, property} = req.params;
    const body = req.body;
    if(!dataBase[tableName][id][property]){
        res.status(404).send(`Property "${property}"  not found`);
    }
    else if(!dataBase[tableName][id][Object.keys(body)]){
        res.status(404).send(`Property "${Object.keys(body)}" in body not found in ${id}`);
    }
    else{
        dataBase[tableName][id][property] = body[property] || dataBase[tableName][id][property];
        res.status(200).send(`property "${property}" was  updated successfully `)
    }
});

module.exports = router;
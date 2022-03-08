const router = require('express').Router();
const Usuario = require('../models/Usuario');


router.put('/:id', async(req,res) =>{
    const id = req.params.id;
    const body = req.body;
    const toUpdate = await Usuario.findByPk(id);
    let count = 0;   
    for(let property in body){
        if(!toUpdate[property]){
            count++;
        }   
    }
    if(count == 0){
        for(let property in body){
                toUpdate[property] = body[property];
                toUpdate.save();
        }
        res.status(200).send('everthing was update sucessfuly');
    }
    else{
        res.status(404).send('Some property sended in the body was not found');
    }
})

router.put('/:id/:property', async(req,res) =>{
    const {id, property} = req.params;
    const body = req.body;
    const toUpdate = await Usuario.findByPk(id);
    if(!toUpdate[property]){
        res.status(404).send(`Property called ${property} was not found`);
    }
    else{
        toUpdate[property] = body[property];
        toUpdate.save();
        res.status(200).send('everthing was update sucessfuly');
    }
})
module.exports = router;

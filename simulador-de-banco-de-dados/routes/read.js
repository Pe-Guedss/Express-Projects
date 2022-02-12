const router = require('express').Router();

router.get('/', (req, res)=> {
    res.send("Implementar rota Read!")
});

module.exports = router;
const {DataTypes} = require('sequelize');
const database = require('../database/db');

const Jogo = database.define('Jogo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
        
    },
    nome_principal: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ano:{
        type: DataTypes.INTEGER
    },
    preco: {
        type: DataTypes.INTEGER
    },
    genero: {
        type: DataTypes.STRING,
        allowNull: false
    }

})
module.exports = Jogo;

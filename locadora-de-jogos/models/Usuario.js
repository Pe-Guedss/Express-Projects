const {DataTypes} = require('sequelize');
const database = require('../database/db');

const Jogo = require('./Jogo');

const Usuario = database.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    }

});
Jogo.belongsTo(Usuario, {
    constraint: true
});
Usuario.hasMany(Jogo);

Usuario.sync({alter: true, force: true});
module.exports = Usuario;


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
    constraint: true,
    foreignKey: 'IdUsuario'
});
Usuario.hasMany(Jogo, {
    constraint: true,
    foreignKey: 'IdUsuario'
});

Usuario.sync();
Jogo.sync();

module.exports = Usuario;


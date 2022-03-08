const Sequelize = require('sequelize');
const sequelize = new Sequelize({ 
    dialect: 'sqlite',
    storage: './database/database.sqlite'
})

const checkConection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully!');
    } catch (error) {
        console.error('Unable to connect to the database due to: \n', error);
    }
};
checkConection();

module.exports = sequelize;
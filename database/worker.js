const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './database/database.sqlite',
});

const reactrole = sequelize.define('reactrole', {
    id: {
        type: Sequelize.INTEGER,
		unique: true,
        primaryKey: true,
    },
    role: {
        type: Sequelize.STRING,
		unique: true,
    },
    message: Sequelize.STRING,
    users: {
        type: Sequelize.ARRAY(Sequelize.STRING),
    }
});

const suggestions = sequelize.define('suggestions', {
    id: {
        type: Sequelize.INTEGER,
		unique: true,
        primaryKey: true,
    },
    up: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    down: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
    },
    users: {
        type: Sequelize.INTEGER,
    },
})

module.exports = {reactrole, suggestions}
/* eslint-disable no-inline-comments */
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: './database/database.sqlite',
});

/* const reactrole = sequelize.define('reactrole', {
    role: Sequelize.STRING,
    reaction: Sequelize.STRING,
    message: Sequelize.STRING(20),
    users: {
        type: Sequelize.STRING(10000),
    },
});*/

const suggestions = sequelize.define('suggestions', {
    id: {
        type: Sequelize.INTEGER(3),
		unique: true,
        primaryKey: true,
    },
    message: {
        type: Sequelize.STRING(18),
		unique: true,
        primaryKey: true,
    },
    content: {
        type: Sequelize.STRING(10000),
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
        type: Sequelize.STRING(1000),
    },
    owner: {
        type: Sequelize.STRING(18),
        primaryKey: true,
    },
}, { timestamps: false });

module.exports = { /* reactrole,*/ suggestions };
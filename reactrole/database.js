const { logger } = require('../utilities/logger.js');
const { reactrole } = require('../database/worker.js');

const createRecord = async (object) => {
    logger('DB: Создание строки реакции c messageID' + object.message);
    await reactrole.create({
        role: object.role,
        reaction: object.reaction,
        message: object.message,
    });
};

module.exports = { createRecord };
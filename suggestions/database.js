const { logger } = require('../utilities/logger.js');
const { suggestions } = require('../database/worker.js');

const setupID = async () => {
    logger('DB: Установка нового id для предложения');
    let find;
    for (let ids = 1; ids != 200 ; ids++) {
        find = await suggestions.findOne({ where: { id: ids } });
        if (find == null) {
            return ids;
        }
    }
};

const createRecord = async (object) => {
    logger('DB: Создание строки предложения c ID' + object.id);
    await suggestions.create({
        id: object.id,
        message: object.message,
        content: object.content,
        up: object.up,
        down: object.down,
        owner: object.owner,
});};

const getRecord = async (messageID) => {
    logger('DB: Получение строки предложения по messageID: ' + messageID);
    return await suggestions.findOne({ where: { message: messageID } });
};
const getRecordById = async (id) => {
    logger('DB: Получение строки предложения по ID: ' + id);
    return await suggestions.findOne({ where: { id: id } });
};
const rmRecord = async (messageID) => {
    logger('DB: Удаление строки предложения по MessageID: ' + messageID);
    suggestions.destroy({ where: { message: messageID } });
};
const updateUsers = async (usersstr, messageID) => {
    logger('DB: Обновление users предложения по messageID: ' + messageID);
    suggestions.update({ users: usersstr }, { where: { message: messageID } });
};
module.exports = { createRecord, getRecord, updateUsers, rmRecord, getRecordById, setupID };
const { DEBUG } = require('../utilities/logger.js');
const { suggestions } = require('../database/worker.js');

const setupID = async () => {
    DEBUG('DB: Установка нового id для предложения');
    let find;
    for (let ids = 1; ids != 200 ; ids++) {
        find = await suggestions.findOne({ where: { id: ids } });
        if (find == null) {
            return ids;
        }
    }
};

const createRecord = async (object) => {
    DEBUG('DB: Создание строки предложения c ID' + object.id);
    await suggestions.create({
        id: object.id,
        message: object.message,
        content: object.content,
        up: object.up,
        down: object.down,
        owner: object.owner,
});};

const getRecord = async (messageID) => {
    DEBUG('DB: Получение строки предложения по messageID' + messageID);
    return await suggestions.findOne({ where: { message: messageID } });
};
const getRecordById = async (id) => {
    DEBUG('DB: Получение строки предложения по ID ' + id);
    return await suggestions.findOne({ where: { id: id } });
};
const rmRecord = async (id) => {
    DEBUG('DB: Удаление строки предложения по ID ' + id);
    suggestions.destroy({ where: { id } });
};
const updateUsers = async (usersstr, messageID) => {
    DEBUG('DB: Обновление users предложения по messageID ' + messageID);
    suggestions.update({ users: usersstr }, { where: { message: messageID } });
};
module.exports = { setupID, createRecord, getRecord, updateUsers, rmRecord, getRecordById };
const { suggestions } = require('../database/worker.js');

const setupID = async () => {
    let find;
    for (let ids = 0; ids != 200 ; ids++) {
        find = await suggestions.findOne({ where: { id: ids } });
        if ( find == null ) {
            return ids;
        };
    };
};

const createRecord = async (object) => {
    await suggestions.create({
        id: object.id,
        message: object.message,
        content: object.content,
        up: object.up,
        down: object.down,
        owner: object.owner,
})};

const getRecord = async (messageID) => {
    return await suggestions.findOne({ where: { message: messageID } });
}
const getRecordById = async (id) => {
    return await suggestions.findOne({ where: { id } });
}
const rmRecord = async (id) => {
    suggestions.destroy({ where: { id } });
};
const updateUsers = async (usersstr, messageID) => {
    suggestions.update({users: usersstr}, { where: { message: messageID } });
}
module.exports = { setupID, createRecord, getRecord, updateUsers, rmRecord, getRecordById };
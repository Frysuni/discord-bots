// Это самое тупое говнокодище, Я ЗНАЮ!!!
let index = 0;
const list = {
    'type0': 'COMPETING', 'name0': 'Норе',
    'type1': 'WATCHING', 'name1': 'новые предложения',
    'type2': 'LISTENING', 'name2': '/help',
    'type3': 'PLAYING', 'name3': 'FrysHost',
};
async function changestatus(client) {
    if (index != 3) {
        index = index + 1;
    } else {
        index = 0;
    }
    const setType = list['type' + index];
    const setName = list['name' + index];
    await client.user.setPresence({ activities: [{ type: setType, name: setName }], status: 'idle' });

}

module.exports = {
    async statusrotate(client) {
        setInterval(() => changestatus(client), 10000);
    },
};
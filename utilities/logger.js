const fs = require('fs');

async function Info(arg) {
    construct(`[   Info  ]: ${arg}`);
    writeFile(`[   Info  ]: ${arg}`);
}

async function Error(arg) {
    construct(`[  Error  ]: ${arg}`);
    writeFile(`[  Error  ]: ${arg}`);
}

async function DEBUG(arg) {
    construct(`[  DEBUG  ]: ${arg}`);
    writeFile(`[  DEBUG  ]: ${arg}`);
}

async function Touch(arg) {
    construct(`[  Touch  ]: ${arg}`);
    writeFile(`[  Touch  ]: ${arg}`);
}

module.exports = {
    Info,
    Error,
    DEBUG,
    Touch,
};

function writeFile(content) {
    let newContent = content;

    try {
        if (!fs.existsSync('./logs')) {
            fs.mkdirSync('./logs');
            fs.writeFileSync('./logs/latest.log', new Date().toLocaleDateString() + '\r\n\r\n');
            Info('Директория logs создана успешно!');
        }
        else if (fs.existsSync('./logs/latest.log')) {
            fs.readFile('./logs/latest.log', 'utf-8', (err, data) => {
                if (err) return Error(err);
                newContent = data + content;
            });
        }
    } catch (err) {
        Error(err);
    }

    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    fs.appendFile('./logs/latest.log', `[ ${date} ][ ${time} ]` + newContent + '\r\n',
        err => {
            if (err) return Error(err);
    });
}

async function construct(str) {
    const time = new Date().toLocaleTimeString();
    console.log(`[ ${time} ]` + str);
}
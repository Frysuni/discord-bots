import { config } from 'dotenv';
import { from } from 'env-var';
import { DataSourceOptions } from 'typeorm';

config();
const env = from(process.env);

const database: any = {
    type:       env.get('DB_DIALECT')  .default('mariadb').asString() as DataSourceOptions['type'],
    host:       env.get('DB_HOST')     .required()        .asString(),
    port:       env.get('DB_PORT')     .default(3306)     .asPortNumber(),
    username:   env.get('DB_USERNAME') .required()        .asString(),
    password:   env.get('DB_PASSWORD') .required()        .asString(),
    database:   env.get('DB_DATABASE') .required()        .asString()
};

const envConfig = {
    debug:      env.get('DEBUG')       .default('false')  .asBool(),
    token:      env.get('TOKEN')       .required()        .asString(),
    client_id:  env.get('CLIENT_ID')   .required()        .asString(),
    log_channel_id: env.get('LOG_CHANNEL_ID').required()  .asString(),
    version:    env.get('VERSION')     .required()        .asString(),
    wsMinecraftPort: env.get('WS_MINECRAFT_PORT').required().asPortNumber()
};

const utils = {
    leave_channel_id: env.get('LEAVE_CHANNEL_ID') .required(true) .asString(),
    ad_channel_id: env.get('AD_CHANNEL_ID')       .required(true) .asString(),
    dianaMemberId:    env.get('DIANA_ID')         .required(true) .asString(),
    mouseMemberId:    env.get('MOUSE_ID')         .required(true) .asString(),
    frysMemberId:     env.get('FRYS_ID')          .required(true) .asString(),
    pomoykaId:        env.get('POMOYKA_ID')       .required(true) .asString(),
    quotes_channel_id: env.get('QUOTES_CHANNEL_ID').required(true) .asString()
};

const yandex = {
    oauthToken: env.get('YANDEX_OAUTH_TOKEN').required().asString(),
    folderId: env.get('YANDEX_FOLDER_ID').required().asString()
};

const openai = {
    apiKey: env.get('OPENAI_API_KEY').required().asString(),
    orgId: env.get('OPENAI_ORG_ID').required().asString(),
    email: env.get('OPENAI_EMAIL').required().asString(),
    pass: env.get('OPENAI_PASS').required().asString(),
    channelId: env.get('OPENAI_CHANNEL_ID').required().asString()
};

export default { ...envConfig, database, utils, yandex, openai };
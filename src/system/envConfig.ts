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

const rankSystem = {
    expPerMsg:  env.get('EXP_PER_MESSAGE').required()     .asString(),
    rewardRoleLvl: env.get('REWARD_ROLE_LEVEL').required() .asIntPositive(),
    rewardRoleId: env.get('REWARD_ROLE_ID').required()     .asString(),
    adChannelId: env.get('NEW_RANK_AD_CHANNEL_ID').required().asString()
};

const envConfig = {
    debug:      env.get('DEBUG')       .default('false')  .asBool(),
    token:      env.get('TOKEN')       .required()        .asString(),
    client_id:  env.get('CLIENT_ID')   .required()        .asString(),
    guild_id:   env.get('GUILD_ID')    .required()        .asString(),
    log_channel_id: env.get('LOG_CHANNEL_ID').required(true).asString(),
    yt_api_key: env.get('YOUTUBE_DATA_API_V3_KEY').required(true).asString()
};

export default { ...envConfig, database, rankSystem };
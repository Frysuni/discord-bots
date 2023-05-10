import { DataSource, DeepPartial, EntityTarget, FindManyOptions, FindOptionsWhere, ObjectID, ObjectLiteral, SaveOptions } from 'typeorm';
import Logger from '@logger';
import envConfig from '@env';
import tableEntities from '@handlers/tableEntities';


export const Database = new DataSource({
    ...envConfig.database,
    synchronize: true,
    logging: false,
    subscribers: [],
    migrations: [],
    entities: tableEntities()
});

export const connectDB = () => {
    return new Promise<void>(resolve => {
        Database.initialize()
        .then(() => {
            Logger.Debug('База данных успешно подключена.');
            resolve();
        })
        .catch(async e => {
            await Logger.Error('Ошибка подключения к базе данных: ' + e);
            process.exit();
        });
    });
};

export class EntityTable {

    constructor(private Entity: EntityTarget<ObjectLiteral>) {}

    protected table = Database.getRepository(this.Entity);

    /**
     * Получить запись из таблицы.
     */
    public get(where: FindOptionsWhere<ObjectLiteral> | FindOptionsWhere<ObjectLiteral>[]) {
        return this.table.findOneBy(where);
    }

    /**
     * Получить все записи из таблицы, соответсвующие аргументу.
     */
    public list(options?: FindManyOptions<ObjectLiteral>) {
        return this.table.find(options);
    }

    /**
     * Сохранить экземпляр класса Entity в бд.
     */
    public set(entities: DeepPartial<ObjectLiteral>, options?: SaveOptions & { reload: false; }) {
        return this.table.save(entities, options);
    }

    /**
     * Обновить экземпляр класса Entity в бд.
     */
    public update(criteria: string | number | string[] | FindOptionsWhere<ObjectLiteral> | Date | ObjectID | number[] | Date[] | ObjectID[], partialEntity: any) {
        return this.table.update(criteria, partialEntity);
    }
    /**
     * Удалить запись из таблицы, соответсвующую аргументу.
     */
    public remove(where: FindOptionsWhere<ObjectLiteral> | FindOptionsWhere<ObjectLiteral>[]) {
        return this.table.findOneBy(where)
                .then(record => this.table.remove(record));
    }
}


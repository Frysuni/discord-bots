// Не обращайте внимания на ошибки. Модуль находится не в src.

import { EntityTable } from '@database';
import { myDatabaseTable, myOtherDatabaseTable } from './entity';

const myTable = new EntityTable(myDatabaseTable);

// Добавление своего функционала, если это требует ООП
class EntityTableModificated extends EntityTable {
    public newFn() {
        // some code...
    }
}

const myOtherTable = new EntityTableModificated(myOtherDatabaseTable);

export async function doSomething() {
    const myRecord = await myTable.get({ id: 1 });
    console.log(myRecord);

    const allMyRecords = await myOtherTable.list({ order: { id: 'ASC' } }); // Массив объектов с id 1, 2, 3

    // и т.д.
}


const remove = (entities, key) => {
    const entity = entities[key];

    if (!entity) {
        return;
    }

    delete entities[key];
    return entities;
}

const add = (entities, entity, entityName) => {
    entities[entityName] = entity;
    return entities;
}

const find = (entities, keyName) => {
    if (!entities || !keyName) {
        return;
    }
    const key = Object.keys(entities).find(key => key.includes(keyName))

    return entities[key];
}

export { add, remove, find }
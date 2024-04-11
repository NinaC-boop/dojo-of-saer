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

const playAudio = (file, onLoop) => {
    var audio = document.createElement('audio');
    audio.src = file;
    document.body.appendChild(audio);
    audio.play();
    audio.loop = onLoop || false;
    
    audio.onended = function () {
        this.parentNode.removeChild(this);
    }
}

export { add, remove, find, playAudio }
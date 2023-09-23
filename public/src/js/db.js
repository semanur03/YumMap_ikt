const db = idb.openDB('posts-store', 1, {
    upgrade(db) {
        // Create a store of objects
        const store1 = db.createObjectStore('posts', {
            // The '_id' property of the object will be the key.
            keyPath: '_id',
        });
        // Create an index on the '_id' property of the objects.
        store1.createIndex('_id', '_id');

        // Create another store of objects
        const store2 = db.createObjectStore('sync-posts', {
            keyPath: 'id',
        });
        store2.createIndex('id', 'id');
    },
});

function writeData(st, data) {
    return db
        .then( dbPosts => {
            let tx = dbPosts.transaction(st, 'readwrite');
            let store = tx.objectStore(st);
            store.put(data);
            return tx.done;
        })
}

function readAllData(st) {
    return db
        .then( dbPosts => {
            let tx = dbPosts.transaction(st, 'readonly');
            let store = tx.objectStore(st);
            return store.getAll();
        })
}

function clearAllData(st) {
    return db
        .then( dbPosts => {
            let tx = dbPosts.transaction(st, 'readwrite');
            let store = tx.objectStore(st);
            store.clear();
            return tx.done;
        })
}

function deleteOneData(st, _id) {
    db
    .then( dbPosts => {
        let tx = dbPosts.transaction(st, 'readwrite');
        let store = tx.objectStore(st);
        store.delete(_id);
        return tx.done;
    })
    .then( () => {
        console.log('Data deleted ...');
        });
}

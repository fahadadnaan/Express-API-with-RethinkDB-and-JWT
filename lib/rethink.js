const rdb = require('rethinkdb');
const dbConfig = require('../config/database');

rdb.connect(dbConfig)
.then( (connection) => {

  

module.exports.find =  (tableName, id) => {
    return new Promise( async (resolve, reject) => {
    const data =  await rdb.table(tableName).get(id).run(connection)
    .then(result => result);
    resolve(data);
    reject(new Error("find")); 
});
};

module.exports.findAll =  (tableName) => {
    return new Promise(async (resolve, reject) => {
       const data =  await rdb.table(tableName).run(connection)
        .then(cursor => cursor.toArray());
        resolve(data);
        reject(new Error("findAll")); 
});
};

module.exports.findBy =  (tableName, fieldName, value) => {
    return new Promise(async (resolve, reject) => {
        const data =  await rdb.table(tableName).filter(rdb.row(fieldName).eq(value)).run(connection)
        .then(cursor => cursor.toArray());
        resolve(data);
        reject(new Error("findBy")); 
});
};


module.exports.findByMatch =  (tableName, fieldName, value) => {
    return new Promise(async (resolve, reject) => {
        const data =  await rdb.table(tableName).filter(function(doc){
            return doc(fieldName).match(value)
        }).run(connection)
        .then(cursor => cursor.toArray());
        resolve(data);
        reject(new Error("findByMatch")); 
});
};

module.exports.pagination =  (tableName, index,offset,limit) => {
    return new Promise(async (resolve, reject) => {
    try {
    const data =  await rdb.table(tableName).orderBy(rdb.desc(index)).skip(offset).limit(limit).run(connection)
    .then(cursor => cursor.toArray());
    resolve(data);
    } catch (error) {
        reject(error); 
    }
    });
};

module.exports.findIndexed =  (tableName, index) => {
    return new Promise(async (resolve, reject) => {
    // first create index for created_at 
    // .indexCreate("created_at")
    const data =  await rdb.table(tableName).orderBy(rdb.desc(index)).run(connection)
    .then(cursor => cursor.toArray());
    resolve(data);
    reject(new Error("findIndexed")); 
    });
};

// module.exports.findIndexed =  (tableName, query, index) => {
//     return new Promise(async (resolve, reject) => {
//     try {
//     const data =  await rdb.table(tableName).getAll(query, { index: index }).run(connection)
//     .then(cursor => cursor.toArray());
//     resolve(data);
//     } catch (error) {
//         reject(error); 
//     }
//     });
// };

module.exports.save =  (tableName, object) => {
    return new Promise(async (resolve, reject) => {
        const data =  await rdb.table(tableName).insert(object, {returnChanges: true}).run(connection)
        .then(result => result.changes[0].new_val);
        resolve(data);
        reject(new Error("save")); 
    });
};

module.exports.edit = async (tableName, id, object) => {
    return new Promise(async (resolve, reject) => {
        const data =  await rdb.table(tableName).get(id).update(object).run(connection)
        .then(result => result);
        resolve(data);
        reject(new Error("edit")); 
    });
};


module.exports.destroy = async (tableName, id) => {
    return new Promise(async (resolve, reject) => {
        const data =  await rdb.table(tableName).get(id).delete().run(connection)
        .then(result => result);
        resolve(data);
        reject(new Error("destroy")); 
    });
};

});

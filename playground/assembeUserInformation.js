/* 
Let's do some more pratice. One last challenge and we are done!

You are a developer in a big company, with multiple databases across the world. Your job is to assemble all the information for a user personnel profile. However, the information is distributed in different databases and services.

Your function takes a simple id (a number) and you have to return a promise with an object as data. The object must contains all this information:

{
    id: A number,
    username: A string,
    country: A string,
    firstname: A string,
    lastname: A string,
    email: A string
}
To achieve your task, you must use the different provided services:

central: Due to the number of users, we can't store them in a single database. So we have 3 databases. The central database identifies in which database the users are stored. Use it like this: central(id).then(function(data) { ... }). data is a string with 3 possibles values: 'db1', 'db2' and 'db3'. If the central database has an error, your function must return a rejected promise with 'Error central' in the data.
db1, db2 and db3 contain the basic information for the users. Use it like this: db1(id).then(function(data) { ... }). data is an object containing 2 properties: username and country. If a database has an error, your function must return a rejected promise with 'Error db1' (or 'Error db2' or 'Error db3') in the data.

vault: Personal data is restricted by law. This particular type of data is often stored in a specific database. The vault can be used to obtain personal information about a user. Use it like this: vault(id).then(function(data) {...}). data is an object with 3 properties: firstname, lastname and email. If the vault has an error, your function must return a rejected promise with 'Error vault' in the data.

mark: Every time someone reads a user profile, we must mark it. The mark service will create this mark. Use it like this: mark(id).then(function() { ... }). Do not call the mark service if another service is in error. Also, do not wait for the mark service to complete processing. If the mark service has an error, don't do anything specific. Just return your promise with the information.
Every service responds in 100ms, except vault. (Security for personal data is heavier, so it's slower. It will respond in 150ms.) Your code must respond in 200ms. If multiple services are in error, return the first error you found.
*/

let central = require('./central'),
    db1 = require('./db1'),
    db2 = require('./db2'),
    db3 = require('./db3'),
    vault = require('./vault'),
    mark = require('./mark')

const assembleUserInformationByID = (id) => {
    let dbs = {
        db1: db1,
        db2: db2,
        db3: db3,
    }

    return new Promise((resolve, reject) => {
        Promise.all([
            central
                .catch(() => {
                    return Promise.reject('Error central')
                })
                .then((db) => {
                    return dbs[db](id).catch(() => {
                        return Promise.reject('Error ' + dbs[db])
                    })
                }),
            vault.catch(() => {
                return Promise.reject('Error vault')
            }),
        ])
            .then((data) => {
                mark.catch(() => {})

                resolve({
                    id: id,
                    username: data[0].username,
                    country: data[0].country,
                    firstname: data[1].firstname,
                    lastname: data[1].lastname,
                    email: data[1].email,
                })
            })
            .catch((err) => {
                reject(err)
            })
    })
}

module.exports = assembleUserInformationByID
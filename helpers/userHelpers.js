const collections = require('../config/collections')
const db = require('../config/connection')
const bcrypt = require('bcrypt')
const { use } = require('../routes/users')
const { response } = require('express')
module.exports = {
    doSignUp: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((response) => {
                resolve(response.ops[0])
            })
        })
    },
    doLogin: async (userData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {};
            const user = await db.get().collection(collections.USER_COLLECTION).findOne({ email: userData.email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        console.log("success");
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    } else {
                        console.log("no match");
                        resolve({ status: false });

                    }
                })
            } else {
                console.log("no user");
                resolve({ status: false });


            }
        })
    }
}
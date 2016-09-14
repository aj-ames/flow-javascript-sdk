"use strict";
const Scandit = require('scandit-flow-sdk');
const CONFIG = require('./config');

let client = new Scandit.Client({
    method: Scandit.Auth.Method.STATIC_KEY,
    key: CONFIG.STATIC.API_KEY,
    storage: Scandit.Auth.Storage.NO_STORAGE
});

client.init()
    .then(function(authStatus) {
        if (authStatus) {
            console.log('Valid token');
            console.log("\n");
            console.log('Models:');
            console.log(client.Db.getAvailableModels());
            console.log("\n\n");
            let model = client.Db.getAvailableModels()[0];
            console.log(`client.Db.${model}.all({limit: 100}):`);
            client.Db[model].all({limit: 100})
                .then((objs) => {
                    console.log('Returned objects:');
                    objs.forEach(function (o) {
                        let output = '';
                        client.Db[model].getFields().forEach(function(f) {
                            output += f + " = " + o[f] + "; ";
                        });
                        console.log(output);
                    });
                })
                .catch((err) => {
                    console.log('client.Db.' + model + '.all({limit: 100})', 'Error: ' + err);
                });
        } else {
            console.log('Invalid token');
        }
    })
    .catch(function(err) {
        console.log('Error:');
        console.log(err.stack);
    });

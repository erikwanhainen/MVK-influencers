const { Client } = require("pg");
// pools will use environment variables
// for connection information
const client = new Client({
    host: process.env.DBHOST || "localhost",
    port: 5432,
    database: process.env.DBDB || "MVK",
    user: process.env.DBUSER || "postgres",
    password: process.env.DBPASS || "123"
});
/**
 * Connect client to database
 */
function connect() {
    client.connect(err => {
        if (err) {
            console.log("connection error", err.stack);
        } else {
            console.log("connected");
        }
    });
}

/**
 * Store data on index i in database
 * @param {jsonarray} data - data to be stored
 * @param {int} i - index
 */
function storeDataRiksdagsledamot(data, i) {
    return new Promise(function(resolve, reject) {
        if (
            data[i].intressent_id != null &&
            data[i].parti != null &&
            data[i].sorteringsnamn != null
        ) {
            resolve(
                client.query(
                    "INSERT INTO riksdagsledamot(person_id,namn,parti) VALUES($1,$2,$3) ON CONFLICT DO NOTHING", [data[i].intressent_id, data[i].sorteringsnamn, data[i].parti]
                )
            );
        } else {
            resolve();
        }
    }).catch(function(err) {
        console.log(err);
        //Maybe we should log errors that occure? Errors will be inserts of duplicates etc

    });
}
/**
 * Store data on index i in database
 * @param {jsonarray} data- data to be stored
 * @param {int} i - index
 */
function storeDataAnforandetext(data, i) {
    return new Promise(function(resolve, reject) {
        if (
            data[i].intressent_id != null &&
            data[i].anforande_id != null &&
            data[i].dok_datum != null &&
            data[i].anforandetext != null
        ) {
            let date = data[i].dok_datum;
            resolve(
                client.query(
                    "INSERT INTO anforandetext(anforande_id,text,datum,person_id) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING", [
                        data[i].anforande_id,
                        data[i].anforandetext,
                        date.substring(0, date.length - 8),
                        data[i].intressent_id
                    ]
                )
            );
        } else {
            resolve();
        }
    }).catch(function(err) {
        console.log(err);
        //Maybe we should log errors that occure? Errors will be inserts of duplicates etc
    });
}
/**
 * data sent from addDataVotering is stored in database
 * @param {jsonarray} data - data to be stored in db 
 */
function storeDataVotering(data) {
    return new Promise(function(resolve, reject) {
        //console.log(data[i].votering_id);
        if (
            data.votering_id != null &&
            data.intressent_id != null &&
            data.rost != null &&
            data.datum != null
        ) {
            let date = data.datum;
            resolve(
                client.query(
                    "INSERT INTO voteringar(voterings_id,person_id,vot,vot_datum) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING", [
                        data.votering_id,
                        data.intressent_id,
                        data.rost,
                        date.substring(0, date.length - 8),
                    ]
                )
            );
        } else {
            reject(data);
        }
    }).catch(function(err) {
        console.log(err);
        //Maybe we should log errors that occure? Errors will be inserts of duplicates etc
    });
}

/**
 * add all riksdagsledamöter to database
 * @param {jsonarray} data - data to be stored
 */
async function addDataRiksdagsledamot(data) {
    var i;
    for (i = 0; i < data.length; i++) {
        if (data[i] !== undefined) {
            await storeDataRiksdagsledamot(data, i);
        }
    }
}
/**
 * add anforandetext and other information regarding anforande to database
 * @param {jsonarray} data - data to be stored
 */
async function addDataAnforandetext(data) {
    var i;
    for (i = 0; i < data.length; i++) {
        if (data[i] !== undefined) {
            await storeDataAnforandetext(data, i);
        }
    }
}
/**
 * add votering and other information regarding voteringar to database
 * @param {jsonarray} data data to be stored
 */
async function addDataVotering(data) {
    var i;
    for (i = 0; i < data.length; i++) {
        if (data[i] !== undefined) {
            for (let j = 0; j < data[i].length; j++) {
                await storeDataVotering(data[i][j]);
            }
        }
    }
}

/**
 * Disconnect the client from the database
 */
function disconnect() {
    client.end(err => {
        console.log("client has disconnected");
        if (err) {
            console.log("error during disconnection", err.stack);
        }
    });
}
exports.connect = connect;
exports.disconnect = disconnect;
exports.addDataRiksdagsledamot = addDataRiksdagsledamot;
exports.addDataAnforandetext = addDataAnforandetext;
exports.addDataVotering = addDataVotering;
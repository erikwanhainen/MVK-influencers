ledamotUrl =
    "http://data.riksdagen.se/personlista/?iid=&fnamn=&enamn=&f_ar=&kn=&parti=&valkrets=&rdlstatus=samtliga&org=&utformat=json&sort=sorteringsnamn&sortorder=asc&termlista=";

var request = require("request");
var fs = require("fs");
const db = require("./db");
var pyShell = require("python-shell");

/**
 * Get all riksdagsledamöter that has been in the swedish riksdag since 1991
 * @param {string} url - riksdagens api
 */
function getRiksdagsledamot(url) {
    console.log("Starting fetch of riksdagsledamöter.")
    return new Promise(function(resolve, reject) {
        request(url, function(error, response, body) {
            // in addition to parsing the value, deal with possible errors
            if (error) return reject(error);
            try {
                if (body == "") {
                    console.log("Empty string");
                    resolve();
                }
                const data = JSON.parse(body); // can throw an exception if not valid JSON
                resolve(data.personlista.person);
            } catch (e) {
                reject(e);
            }
        }).end();
    });
}

/**
 * Get number of pages to get results from
 * @param {string} url - url to riksdagens api 
 */
function getNumberOfVoteringPages(url) {
    console.log("Starting fetch of voteringar")
    return new Promise(function(resolve, reject) {
        request(url, function(error, response, body) {
            // in addition to parsing the value, deal with possible errors
            if (error) return reject(error);
            try {
                if (body == "") {
                    console.log("Empty string");
                    resolve();
                }
                const data = JSON.parse(body); //can throw an exception if not valid JSON
                resolve(data.dokumentlista["@sidor"]);

            } catch (e) {
                reject(e);
            }
        }).end();
    });
}

/**
 * Get voteringsID from riksdagens api
 * @param {string} url - url to riksdagens api 
 */
function getVoteringslista(url) {
    return new Promise(function(resolve, reject) {
        request(url, function(error, response, body) {
            let votid = [];
            // in addition to parsing the value, deal with possible errors
            if (error) return reject(error);
            try {
                if (body == "") {
                    console.log("Empty string");
                    resolve();
                }
                const data = JSON.parse(body); //can throw an exception if not valid JSON
                let hitFrom = parseInt(data.dokumentlista["@traff_fran"], 10);
                let hitTo = parseInt(data.dokumentlista["@traff_till"], 10);
                for (let i = 0; i < (hitTo - hitFrom) + 1; i++) {
                    votid.push(data.dokumentlista.dokument[i].kall_id);
                }
                resolve(votid);
            } catch (e) {
                reject(e);
            }
        }).end();
    });
}
/**
 * Get all voteringsresult from riksdagens api, uses voteringsID from getVoteringslista
 * @param {string} url - url to riksdagens api 
 */
function getVoteringslistaResult(url) {
    return new Promise(function(resolve, reject) {
        request(url, function(error, response, body) {
            // in addition to parsing the value, deal with possible errors
            if (error) return reject(error);
            try {
                if (body == "") {
                    console.log("Empty string");
                    resolve();
                }
                const data = JSON.parse(body); //can throw an exception if not valid JSON
                if (data.votering.dokvotering === undefined) {
                    resolve();
                } else {
                    resolve(data.votering.dokvotering.votering);

                }
            } catch (e) {
                reject(e);
            }
        }).end();
    });
}

/**
 * Function to compose URL for Anforanden.
 * @param {string} date - on form 2020-03-23, fetch all anforanden from this date up until todays date
 * @param {string} iid - Optional param->use empty string if not applied.identificationnumber for persons in riksdagen. Can be used to fetch anforanden made by a specific person
 */
function createAnforandeURL(date, iid) {
    return (
        "http://data.riksdagen.se/anforandelista/?rm=&anftyp=&d=" +
        date +
        "&ts=&parti=&iid=" +
        iid +
        "&sz=10000&utformat=json"
    );
}
/**
 * Function to compose URL for fetching links to vaddDataVoteringoteringar. datefrom, dateto and iid are all optional choices.
 * If left empty all voteringar that are possible to fetch will be fetched. 
 * 
 * @param {*} datefrom the date you want to start collecting voteringar from
 * @param {*} dateto the date you want to end collecting voteringar from
 * @param {*} iid if you want to collect voteringar from a specific person
 */
function createVoteringURL(datefrom, dateto, iid, page) {
    return (
        "http://data.riksdagen.se/dokumentlista/?sok=&doktyp=votering&rm=&from=" +
        datefrom +
        "&tom=" +
        dateto +
        "&ts=&bet=&tempbet=&nr=&org=&iid=" +
        iid +
        "&webbtv=&talare=&exakt=&planering=&sort=datum&sortorder=asc&rapport=&utformat=json&p=" +
        page);
}

/**
 * Construct URL to riksdagens api where votid is voteringsID collected from getVoteringslista.
 * @param {string} votid - voteringsID 
 */
function createVoteringResultURL(votid) {
    return ("http://data.riksdagen.se/votering/" +
        votid +
        "/json");
}
/**
 * Fetch all links to anforandetexter
 * @param {string} url - riksdagens api
 */
function getTextLink(url) {
    return new Promise(function(resolve, reject) {
        request(url, function(error, response, body) {
            // in addition to parsing the value, deal with possible errors
            let links = [];
            if (error) return reject(error);
            try {
                if (body == "") {
                    console.log("Empty string");
                    resolve();
                }
                // JSON.parse() can throw an exception if not valid JSON
                const data = JSON.parse(body);
                for (var i = 0; i < data.anforandelista.anforande.length; i++) {
                    const url = data.anforandelista.anforande[i].anforande_url_html;
                    links.push(url.substring(0, url.length - 4) + "json");
                }
                console.log("Done getTextLink");
                resolve(links);
            } catch (e) {
                reject(e);
            }
        }).end();
    });
}
/**
 * Fetch all data regarding anforanden
 * @param {string} url - riksdagens api
 */
function getText(url) {
    return new Promise(function(resolve, reject) {
        request(url, function(error, response, body) {
            // in addition to parsing the value, deal with possible errors
            if (error) return reject(error);
            try {
                if (body == "") {
                    console.log("Empty string");
                    resolve();
                }
                const data = JSON.parse(body); // can throw an exception if not valid JSON
                resolve(data.anforande);
            } catch (e) {
                reject(e);
            }
        }).end();
    });
}



/**
 * Fetch all anforandetexter
 * @param {array} links - contains all links to anforanden
 */
async function loopLinks(links) {
    let proms = [];
    for (let i = 0; i < links.length; i++) {
        proms.push(getText(links[i]));
    }
    const res = await Promise.all(proms);
    return res;
}
/**
 * Function that takes an large array with anforandetexter and split it into smaller arrays to prevent ETIMEDOUTerror
 * @param {array} links contains links to all anforandetexter
 */
async function sliceArrayAnforande(links) {
    console.log("Starting fetch of anförandetexter")
    let temp = [];
    for (let i = 0; i < links.length; i = i + 300) {
        try {
            if ((i + 300) < links.length) {
                temp = await loopLinks(links.slice(i, (i + 300)));
                await writeToAnforandetext(temp);
            } else {
                temp = await loopLinks(links.slice(i, links.length));
                await writeToAnforandetext(temp);
            }
        } catch (error) {
            console.log(error);
        }
    }
    console.log("Fetch and store anförandetexter done.")
}
/**
 * Loop through different pages that contains up to 20 voteringsid and fetch them.
 * @param {*} datefrom Startdate
 * @param {*} dateto Enddate
 * @param {*} iid Person id
 * @param {*} pages keep track on how many pages to loop through
 */
async function loopPages(datefrom, dateto, iid, pages) {
    let proms = [];
    for (let i = 1; i <= pages; i++) {
        proms.push(getVoteringslista(createVoteringURL(datefrom, dateto, iid, i)));
    }
    const res = await Promise.all(proms)
    return res;

}

/**
 * loop through arr to create a call to riksdagens api and collect voteringsresults.
 * @param {jsonarray} arr - contains all voteringsid 
 */
async function loopVotering(arr) {
    let proms = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++)
            proms.push(getVoteringslistaResult(createVoteringResultURL(arr[i][j])));
    }
    const res = await Promise.all(proms);
    return res;
}
/* *
 * Function to slice a large array of voteringar to smaller arrays to prevent ETIMEDOUT error.
 * @param {*} arr This array contains all information about voteringar that we want to store. 
 */
async function sliceArrayVoteringar(arr) {
    let temp = [];
    for (let i = 0; i < arr.length; i = i + 20) {
        try {
            if ((i + 20) < arr.length) {
                temp = await loopVotering(arr.slice(i, (i + 20)));
                await writeToVotering(temp);
            } else {
                temp = await loopVotering(arr.slice(i, arr.length));
                await writeToVotering(temp);
            }
        } catch (error) {
            console.log(error);
        }
    }

}


/**
 * Store data in table riksdagsledamöter
 * @param {array} data - contains all data fetch from getRiksdagsledamot
 */
async function writeToRiksdagsledamot(data) {
    await db.addDataRiksdagsledamot(data);
}

/**
 * Store data in table anforandetext
 * @param {array} data - contains all data from getText
 */
async function writeToAnforandetext(data) {
    await db.addDataAnforandetext(data);
}

/**
 * Store data in table voteringar
 * @param {array} data 
 */
async function writeToVotering(data) {
    await db.addDataVotering(data);
    console.log("Fetch and store voteringar done.")
}

//Skapa promise för att behandla datan
function processData() {
    return new Promise(function(resolve, reject) {
        pyShell.PythonShell.run("../dataprocessing/test_data.py", null, function(
            err
        ) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve("finished");
            }
        });
    });
}
var dateStart = "2019-02-01";
var dateEnd = "2020-04-19";
db.connect();
getRiksdagsledamot(ledamotUrl)
    .then(arr => writeToRiksdagsledamot(arr))
    .then(() => getTextLink(createAnforandeURL(dateStart, "")))
    .then(arr => sliceArrayAnforande(arr))
    .then(() => getNumberOfVoteringPages(createVoteringURL(dateStart, dateEnd, "", 1)))
    .then(res => loopPages(dateStart, dateEnd, "", res))
    //.then(arr => loopVotering(arr))
    //.then(res => writeToVotering(res))
    .then(arr => sliceArrayVoteringar(arr))
    //.then(() => processData())
    //.then(t => console.log(t))
    .then(() => db.disconnect())
    .catch((err) => console.log(err));
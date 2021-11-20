    docUrl = "http://data.riksdagen.se/anforandelista/?rm=&anftyp=&d=&ts=&parti=M&iid=&sz=10&utformat=json";

    var request = require("request");
    anforanden = [];
    
    function getTextLink(url) {
        return new Promise(function(resolve, reject) {
            request(url, function (error, response, body) {
                // in addition to parsing the value, deal with possible errors
                if (error) return reject(error);
                try {
                    // JSON.parse() can throw an exception if not valid JSON
                    response = JSON.parse(body);
                    for (var i = 0; i < response.anforandelista.anforande.length; i++) {
                        anforanden.push([
                        response.anforandelista.anforande[i].anforande_url_html]);
                    }
                    resolve(anforanden);
                } catch(e) {
                    reject(e);
                }
            });
        });
    }
    
    function getNextUrl(url, callback) {
        request.get(url, (error, response, body) => {
            if(error) {
                return console.dir(error);
            }
            var jsonParsed = (JSON.parse(body));
            var nextUrl = jsonParsed.dokumentlista.nasta_sida;
            return callback(nextUrl);
        });
    }
    
    getTextLink(docUrl).then(function(val) {
        console.log(val);
    }).catch(function(err) {
        console.log(err);
    });
    
    


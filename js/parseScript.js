var iter = 0;
var maxNum = 0;
// Initialize and add the map
function initMap(latitude = 42, longitude = 32) {
    console.log("map");
    // The location of Uluru
    var uluru = {lat: latitude, lng: longitude};
    // The map, centered at Uluru
    if (document.getElementById("map") !== null) {
        var map = new google.maps.Map(
        document.getElementById("map"), {zoom: 5, center: uluru});
        // The marker, positioned at Uluru
        var marker = new google.maps.Marker({position: uluru, map: map});
    }
}

// gets email header and parses the text for all the ip Address
function parse() {
    iter = 0;
    let areaText = document.getElementById("textToParse").value; 
    if (!areaText) {
        document.getElementById("dataTable").style.display = "none";
        document.getElementById("map").style.display = "none";
        document.getElementById("messageID").style.display = "none";
        return
    }
    // extract all IP addresses
    var text = document.getElementById("textToParse").value; 
    var regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
    var regex2 = /Message-ID:(\s+|)((.?))([^\s]+)/g
    ipAll = text.match(regex);
    // remove duplicates ip addresses
    publicIPs = Array.from(new Set(ipAll));
    // extract message ID from header
    messageID = text.match(regex2);
    if (messageID == null) {
        messageID = "N/A";
    } else {
        messageID = messageID[messageID.length-1];
    }

    maxNum = publicIPs.length;
    // clear text area and table for every button press
    document.getElementById("textToParse").value = "";
    let tableBody = document.getElementById("ipTableBody").innerHTML = "";

    // get geolocation promises based on IP addresses
    let promises = [];
    for (let i = 0; i < publicIPs.length; ++i) {
        promises.push(runPromiseRequestGL(publicIPs[i]));
    }

    let finalArray = [];
    // return all geolocation promises at the same time. Catch private IP addresses
    Promise.all(promises)
        .then(results => {
            for (let i = 0; i < results.length; i++) {
                if (typeof(results[i].ip) !== "undefined") {
                        lat = parseInt(results[i].latitude);
                        lng = parseInt(results[i].longitude);
                        initMap(lat, lng);
                        renderTable(results[i].ip, results[i].country, results[i].region, results[i].countryCode, results[i].flagURL);
                        finalArray.push(results[i].ip);
                }
          }
      })
      .catch(err => {
        console.log(err); 
        });
        
      displayBody(messageID);
}

// callback function for all geolocation promises
async function runPromiseRequestGL(uniqueIP) {
    let url = "https://api.ipgeolocation.io/ipgeo?apiKey=9bec34ed8a974713a5d07634236b1ae8&ip=" + uniqueIP;
    let reponse = await fetch(url)
    let json = await reponse.json();
    ip = json.ip;
    if (typeof(ip) == "undefined") {
        maxNum = maxNum - 1;
    }
    return {
        ip: json.ip,
        country: json.country_name,
        region: json.state_prov,
        countryCode: json.country_code,
        flagURL: json.country_flag,
        latitude: json.latitude,
        longitude: json.longitude
    };
}

// callback function for virus total promises
async function runPromiseRequestVT(uniqueIP) {
    let url = "https://www.virustotal.com/vtapi/v2/ip-address/report?apikey=a084c74b1c2c65e9cc351b26ad193ff2b83d2a3359850e298af64442a22b7627&ip=" + uniqueIP;
    let reponse = await fetch(url)
    let json = await reponse.json();
    try {
        ip = json.resource;
    } catch {
        console.log("There is no ip found");
        console.error(err);
    }
    return {
        ip: json.resource,
        responseCode: json.response_code,
        scanDate: json.scan_date,
        permalink: json.permalink,
        positives: json.positives,
        total: json.total 
    };
}

function renderTable(ip, country, region, countryCode, flagURL) {
    iter = iter + 1;
    let numCols = 5;

    // let virusTotalURL = "https://www.virustotal.com/vtapi/v2/ip-address/report?apikey=a084c74b1c2c65e9cc351b26ad193ff2b83d2a3359850e298af64442a22b7627&ip=" + ip;
    // let vtPng = "https://www.virustotal.com/gui/images/favicon.png"

    let talosURL = "https://talosintelligence.com/reputation_center/lookup?search=" + ip;
    let talosIco = "https://talosintelligence.com/assets/favicons/favicon-49c9b25776778ff43873cf5ebde2e1ffcd0747ad1042ac5a5306cdde3ffca8cd.ico"

    if (iter == maxNum) {
        ip = "*" + ip.trim();
    }

    let tableData = [ip, talosURL, country, region, countryCode];

    if (!region) {
        tableData[3] = "N/A";
    }

    let tr = document.createElement("TR");
    document.getElementById("ipTableBody").appendChild(tr); 

    // append a row to table body with geo location info
    for (let i = 0; i < numCols; ++i) {
            let td = document.createElement("TD");
            tr.appendChild(td);
        if (i === 1) {
            let a = document.createElement("a");
            a.setAttribute("href", tableData[i]);
            a.setAttribute("target", "_blank");

            let img = document.createElement("img");
            img.setAttribute("src", talosIco);
            img.setAttribute("height", "13");
            img.setAttribute("width", "18");
            a.append(img);
            td.append(a);

        } else if (i === 4) {
            let img = document.createElement("img");
            img.setAttribute("src", flagURL);
            img.setAttribute("height", "13");
            img.setAttribute("width", "18");
            td.appendChild(img);
        } else {
            td.appendChild(document.createTextNode(tableData[i]));
        }
    }

    return;
}

function reqListener() {
    console.log(this.responseText);
}

function transferFailed(evt) {
    console.log("An error occurred while transferring the file.");
}

function displayBody(messageID) {
    document.getElementById("dataTable").style.display = "block";
    document.getElementById("map").style.display = "inline-block";
    document.getElementById("messageID").innerHTML = messageID;
    document.getElementById("messageID").style.display = "block";
}

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
    var regex2 = /Message-ID:\s+([<'])(.*?)([>'])/g
    ipAll = text.match(regex);
    // remove duplicates ip addresses
    publicIPs = Array.from(new Set(ipAll));
    // extract message ID from header
    messageID = text.match(regex2);
    messageID = messageID[messageID.length-1];
    messageID = messageID.substring(13, messageID.length-1);

    displayBody("MesageID: " + messageID);

    console.log(messageID);
    console.log(publicIPs);

    maxNum = publicIPs.length;
    // clear text area and table for every button press
    document.getElementById("textToParse").value = "";
    let tableBody = document.getElementById("ipTableBody").innerHTML = "";

    // get promises based on IP addresses
    let promises = [];
    for (let i = 0; i < publicIPs.length; ++i) {
        promises.push(runPromiseRequest(publicIPs[i]));
    }

    // return all promises at the same time. Catch private IP addresses
    Promise.all(promises)
        .then(results => {
            for (let i = 0; i < results.length; i++) {
                if (typeof(results[i].ip) !== "undefined") {
                        lat = parseInt(results[i].latitude);
                        lng = parseInt(results[i].longitude);
                        initMap(lat, lng);
                        renderTable(results[i].ip, results[i].country, results[i].region, results[i].countryCode, results[i].flagURL);
                }
          }
      })
      .catch(err => console.log(err));
}

async function runPromiseRequest(uniqueIP) {
    var lat = 0; lng = 0;
    let url = "https://api.ipgeolocation.io/ipgeo?apiKey=9bec34ed8a974713a5d07634236b1ae8&ip=" + uniqueIP;
    let reponse = await fetch(url)
    let json = await reponse.json();
    try {
        ip = json.ip;
    } catch {
        console.log("There is no ip found");
        console.error(err);
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

function renderTable(ip, country, region, countryCode, flagURL) {
    iter = iter + 1;
    let numCols = 5;
    // ip = data["ip"];
    // let url2 = 'https://www.virustotal.com/vtapi/v2/ip-address/report?apikey=a084c74b1c2c65e9cc351b26ad193ff2b83d2a3359850e298af64442a22b7627&ip=' + ip;
    // let request2 = new XMLHttpRequest();
    // request2.responseType = 'json';
    // request2.open('GET', url2);
    // request2.onload = function() {
    //     let data = request2.response;
    // }
    // request2.send();

    party = "virusTotal&Talos";

    if (iter == maxNum - 1) {
        ip = "*" + ip.trim();
    }

    let tableData = [ip, party, country, region, countryCode];

    if (!region) {
        tableData[3] = "N/A";
    }

    let tr = document.createElement("TR");
    document.getElementById("ipTableBody").appendChild(tr); 

    for (let i = 0; i < numCols; ++i) {
            let col = document.createTextNode(tableData[i]);
            let td = document.createElement("TD");
        if (i === 4) {
            let elem = document.createElement("img");
            elem.setAttribute("src", flagURL);
            elem.setAttribute("height", "13");
            elem.setAttribute("width", "18");
            tr.appendChild(td);
            td.appendChild(elem);
        } else {
            tr.appendChild(td);
            td.appendChild(col);
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
    document.getElementById("messageID").innerHTML = "MessageID: " + messageID;
    document.getElementById("messageID").style.display = "block";
}

var iter = 0;
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

    // clear text area and table for every button press
    document.getElementById("textToParse").value = "";
    let tableBody = document.getElementById("ipTableBody").innerHTML = "";

    // let promises = [];
    for (let i = 0; i < publicIPs.length; ++i) {
        runRequest(publicIPs[i]);
    }
    // for (let i = 0; i < publicIPs.length; ++i) {
    //     promises.push(runRequest2(publicIPs[i]));
    // }

    // Promise.all(promises)
    // .then((results) => {

    //     for (let i = 0; i < results.length; ++i) {
    //         if(results[i].ip == null) {
    //             renderTable(/* json object get inputted*/);
    //         }
    //     }
    // })
    // .catch((err) => console.log(err));
}

function runRequest(uniqueIP) {
    var lat = 0; lng = 0;
    let url = "https://api.ipgeolocation.io/ipgeo?apiKey=9bec34ed8a974713a5d07634236b1ae8&ip=" + uniqueIP;
    let request = new XMLHttpRequest();
    request.responseType = "json";
    request.open("GET", url);
    request.onload = function() {
        let data = request.response;
        console.log(data);
        console.log(typeof(data["ip"]) !== "undefined");
        if (typeof(data["ip"]) !== "undefined") {
                lat = parseInt(data["latitude"]);
                lng = parseInt(data["longitude"]);
                initMap(lat, lng);
                renderTable(data);
        }
    }
    request.send();
}


// async function runRequest2(uniqueIP) {
//     var lat = 0; lng = 0;
//     let url = "https://api.ipgeolocation.io/ipgeo?apiKey=9bec34ed8a974713a5d07634236b1ae8&ip=" + uniqueIP;
//     let reponse = await fetch(url)
//     let json = reponse.json();

//     // if (typeof(data["ip"]) !== "undefined") {
//     //         lat = parseInt(data["latitude"]);
//     //         lng = parseInt(data["longitude"]);
//     //         initMap(lat, lng);
//     //         renderTable(data);
//     // }
// }



function renderTable(data) {
    iter = iter + 1;
    let numCols = 5;
    ip = data["ip"];
    // let url2 = 'https://www.virustotal.com/vtapi/v2/ip-address/report?apikey=a084c74b1c2c65e9cc351b26ad193ff2b83d2a3359850e298af64442a22b7627&ip=' + ip;
    // let request2 = new XMLHttpRequest();
    // request2.responseType = 'json';
    // request2.open('GET', url2);
    // request2.onload = function() {
    //     let data = request2.response;
    // }
    // request2.send();

    party = "virusTotal&Talos";
    country = data["country_name"];
    region = data["state_prov"];
    countryCode = data["country_code"];
    flagURL = data["country_flag"];

    if (iter == 1) {
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
